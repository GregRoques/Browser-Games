/* ============================================
   DREIDEL ANIMATOR
   3D CSS dreidel spinning with custom easing
   ============================================ */

/**
 * Mapping from face name to the Y-rotation angle (degrees)
 * needed to show that face to the viewer.
 *
 * With our CSS setup:
 *   Front  (rotateY 0)   → Nun   → parent rotateY(0)   shows front
 *   Right  (rotateY 90)  → Gimmel → parent rotateY(-90) shows right
 *   Back   (rotateY 180) → Hey    → parent rotateY(-180) shows back
 *   Left   (rotateY -90) → Shin   → parent rotateY(90)  shows left
 *
 * We spin in the positive direction (counter-clockwise from above).
 * To land on a face, we need the total rotation to be a multiple
 * that puts that face in front.
 */
var FACE_ANGLES = Object.freeze({
    nun:    0,
    shin:   90,
    hey:    180,
    gimmel: 270
});

/**
 * Total spin duration in milliseconds.
 */
var SPIN_DURATION = 5000;

/**
 * The base tilt applied to the dreidel (X rotation).
 */
var BASE_TILT_X = 12;

/**
 * Number of full rotations during the spin.
 */
var FULL_ROTATIONS = 10;


/**
 * Custom easing function.
 *
 * First 60% of time (≈3 seconds): fast, nearly-linear spinning — covers 80% of rotation.
 * Last 40% of time (≈2 seconds): smooth deceleration — covers remaining 20%.
 *
 * @param {number} t - Progress from 0 to 1.
 * @returns {number} Eased progress from 0 to 1.
 */
function spinEasing(t) {
    if (t <= 0.6) {
        // Fast phase: linear mapping covering 80% of total rotation
        return (t / 0.6) * 0.8;
    }

    // Deceleration phase: cubic ease-out for remaining 20%
    var t2 = (t - 0.6) / 0.4;
    return 0.8 + 0.2 * (1 - Math.pow(1 - t2, 3));
}


/**
 * Spins the dreidel elements to land on a specific face.
 *
 * @param {string} targetFace - One of 'nun', 'gimmel', 'hey', 'shin'.
 * @param {Function} onComplete - Callback when spin finishes.
 */
function spinDreidel(targetFace, onComplete) {
    var targetAngle = FACE_ANGLES[targetFace];
    var totalAngle = (FULL_ROTATIONS * 360) + targetAngle;

    var pivots = document.querySelectorAll('.dreidel-pivot');
    pivots.forEach(function (el) { el.classList.add('spinning'); });

    var startTime = null;

    function animate(timestamp) {
        if (startTime === null) {
            startTime = timestamp;
        }

        var elapsed = timestamp - startTime;
        var progress = Math.min(elapsed / SPIN_DURATION, 1);
        var easedProgress = spinEasing(progress);
        var currentAngle = easedProgress * totalAngle;

        setDreidelRotation(currentAngle);

        if (progress < 1) {
            requestAnimationFrame(animate);
        } else {
            // Ensure we land exactly on the target
            setDreidelRotation(totalAngle);

            pivots.forEach(function (el) { el.classList.remove('spinning'); });

            if (typeof onComplete === 'function') {
                onComplete(targetFace);
            }
        }
    }

    requestAnimationFrame(animate);
}


/**
 * Sets the Y-rotation on all dreidel pivot elements.
 *
 * @param {number} angleDeg - The Y-axis rotation in degrees.
 */
function setDreidelRotation(angleDeg) {
    var pivots = document.querySelectorAll('.dreidel-pivot');
    var transformValue = 'rotateX(' + BASE_TILT_X + 'deg) rotateY(' + angleDeg + 'deg)';

    pivots.forEach(function (el) {
        el.style.transform = transformValue;
    });
}


/**
 * Resets the dreidel to the default resting position (Nun facing front).
 */
function resetDreidel() {
    setDreidelRotation(0);
}
