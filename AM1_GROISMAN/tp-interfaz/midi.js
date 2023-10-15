let midi = null; // global MIDIAccess object

const queryMidi = () => {
  navigator.requestMIDIAccess().then((access) => {
    midi = access;
    access.inputs.forEach((entry) => {
      entry.onmidimessage = onMIDIMessage;
    });
  });
};

function listInputsAndOutputs(midiAccess) {
  for (const entry of midiAccess.inputs) {
    const input = entry[1];
    console.log(
      `Input port [type:'${input.type}']` +
        ` id:'${input.id}'` +
        ` manufacturer:'${input.manufacturer}'` +
        ` name:'${input.name}'` +
        ` version:'${input.version}'`
    );
  }

  for (const entry of midiAccess.outputs) {
    const output = entry[1];
    console.log(
      `Output port [type:'${output.type}'] id:'${output.id}' manufacturer:'${output.manufacturer}' name:'${output.name}' version:'${output.version}'`
    );
  }
}
function onNote(note, velocity) {
  addNote(velocity);
}
function onPad(pad, velocity) {}
function onPitchBend(value) {}
function onModWheel(value) {}

function parseMidiMessage(message) {
  return {
    command: message.data[0] >> 4,
    channel: message.data[0] & 0xf,
    note: message.data[1],
    velocity: message.data[2] / 127,
  };
}
function onMIDIMessage(message) {
  // Parse the MIDIMessageEvent.
  const { command, channel, note, velocity } = parseMidiMessage(message);

  // Stop command.
  // Negative velocity is an upward release rather than a downward press.
  if (command === 8) {
    notes[notes.length - 1].isHolding = false;
  }

  // Start command.
  else if (command === 9) {
    if (channel === 0) onNote(note, velocity);
    else if (channel === 9) onPad(note, velocity);
  }

  // Knob command.
  else if (command === 11) {
    if (note === 1) onModWheel(velocity);
  }

  // Pitch bend command.
  else if (command === 14) {
    onPitchBend(velocity);
  }
}
