class RotatedRectangle {
  constructor(x, y, width, height, angle) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.angle = angle;
  }

  // Check if this rotated rectangle intersects with another rotated rectangle
  intersects(other) {
    const vertices1 = this.calculateVertices();
    const vertices2 = other.calculateVertices();

    let minimumOverlap = Infinity; // We start with infinity and will find the minimum value
    let smallestAxis; // This will hold the smallest axis vector

    // Check for separation along each axis
    const allAxes = this.getAxes(vertices1).concat(other.getAxes(vertices2));
    for (let axis of allAxes) {
      const proj1 = this.project(vertices1, axis);
      const proj2 = this.project(vertices2, axis);

      // Calculate overlap
      let overlap =
        Math.min(proj1.max, proj2.max) - Math.max(proj1.min, proj2.min);

      // If any projection does not overlap, there is no collision along this axis, and thus no collision overall
      if (overlap <= 0) {
        return { intersects: false }; // Separation found, no intersection
      } else {
        // Check if this overlap is the smallest
        if (overlap < minimumOverlap) {
          minimumOverlap = overlap;
          smallestAxis = axis;
        }
      }
    }

    // If we get to here, all projections overlapped, and we've found our axis of minimum penetration
    return {
      intersects: true,
      axis: smallestAxis, // The collision normal
      overlap: minimumOverlap, // You might want this for resolving the collision (pushing the rectangles apart)
    };
  }

  // Calculate the vertices of the rotated rectangle
  calculateVertices() {
    const halfWidth = this.width / 2;
    const halfHeight = this.height / 2;

    // Points relative to the origin (considering the rectangle at (0,0))
    let points = [
      createVector(-halfWidth, -halfHeight),
      createVector(halfWidth, -halfHeight),
      createVector(halfWidth, halfHeight),
      createVector(-halfWidth, halfHeight),
    ];

    // Now, we rotate each point around the origin by this.angle, then translate it to the actual center (this.x, this.y)
    let cosA = cos(this.angle);
    let sinA = sin(this.angle);

    let rotatedTranslatedPoints = points.map((p) => {
      let newX = p.x * cosA - p.y * sinA + this.x;
      let newY = p.x * sinA + p.y * cosA + this.y;
      return createVector(newX, newY);
    });

    return rotatedTranslatedPoints;
  }

  // Get the axes (perpendicular vectors) for a set of vertices
  getAxes(vertices) {
    const axes = [];
    for (let i = 0; i < vertices.length; i++) {
      const p1 = vertices[i];
      const p2 = vertices[(i + 1) % vertices.length];
      const edge = p5.Vector.sub(p1, p2);
      axes.push(createVector(-edge.y, edge.x).normalize());
    }
    return axes;
  }

  // Project vertices onto an axis and return the min and max values
  project(vertices, axis) {
    let _min = Infinity;
    let _max = -Infinity;

    for (let vertex of vertices) {
      const projection = p5.Vector.dot(vertex, axis);
      _min = min(_min, projection); // updating the actual _min
      _max = max(_max, projection); // updating the actual _max
    }
    return { min: _min, max: _max }; // changed from __min and __max to min and max
  }

  // Check if two projections overlap
  overlap(proj1, proj2) {
    return proj1.min <= proj2.max && proj2.min <= proj1.max; // corrected condition to check overlap correctly
  }
  drawVertices() {
    const vertices = this.calculateVertices();
    fill(255, 0, 0); // red color for debugging
    for (let v of vertices) {
      ellipse(v.x, v.y, 10, 10); // drawing points at the vertices
    }
  }
}
class Nota extends RotatedRectangle {
  constructor(angle, note, color) {
    super(innerWidth / 2, innerHeight, 60, 15, angle);
    this.note = note;
    this.color = color;
    this.velocity = createVector(cos(this.angle), sin(this.angle));
  }
  tick() {
    if (this.isHolding) {
      const growth = 1; // or however much you want to grow the rectangle by each tick
      this.width += growth;
      this.y -= growth / 2; // move up by half the growth amount
    } else {
      this.x += this.velocity.x;
      this.y += this.velocity.y;
    }
    // this.drawVertices();
    this.checkCollision();
    this.draw();
    this.playSounds();
  }
  playSounds() {}
  checkCollision() {
    let collides = false;
    for (let o of obstacles) {
      const result = this.intersects(o);
      if (result.intersects) {
        sounds.drop.play();
        collides = true;
        const collisionNormal = result.axis;

        // Calculate the reflection vector
        const dotProduct = this.velocity.dot(collisionNormal);
        const reflection = p5.Vector.sub(
          this.velocity,
          p5.Vector.mult(collisionNormal, 2 * dotProduct)
        );

        // Set this reflection vector as the new velocity
        this.velocity = reflection;
        this.angle = atan2(this.velocity.y, this.velocity.x);
        break;
      }
    }
    if (collides) {
      this.color = "green";
    } else {
      this.color = "white";
    }
  }
  draw() {
    push();
    translate(this.x, this.y);
    rotate(this.angle);
    fill(this.color);
    rectMode(CENTER); // Change here, now the rectangle will be drawn from the center
    rect(0, 0, this.width, this.height); // Notice width and height are swapped because of the rotation
    pop();
  }
}

class Obstacle extends RotatedRectangle {
  constructor(x, y, height, angle) {
    super(x, y, 15, height, angle);
  }
  tick() {
    this.draw();
  }
  draw() {
    push();
    translate(this.x, this.y);
    rotate(this.angle);
    fill("red");
    rectMode(CENTER); // Change here, now the rectangle will be drawn from the center
    rect(0, 0, this.width, this.height); // Width and height order is regular here because of the class specifics
    pop();
  }
}
