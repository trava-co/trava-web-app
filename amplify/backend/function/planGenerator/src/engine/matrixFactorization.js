const tf = require('@tensorflow/tfjs-core')
require('@tensorflow/tfjs-backend-cpu')

function scaledSigmoid(x, temperature=1) {
    return tf.mul(tf.sub(tf.sigmoid(tf.mul(x, temperature)), 0.5), 2)
}

class MatrixFactorization {
    constructor(numLatentFactors=3, learningRate=0.01, maxIterations=1000) {
        this.latent = numLatentFactors
        this.learningRate = learningRate
        this.maxIterations = maxIterations
        this.converged = false
    }

    train(targetMatrix) {
        if (targetMatrix.shape[0] < 2) {
            return targetMatrix
        }

        let U = tf.ones([targetMatrix.shape[0], this.latent])
        let I = tf.ones([this.latent, targetMatrix.shape[1]])

        let oldError = tf.tensor([1e6])
        this.converged = false
        for (let i = 0; i < this.maxIterations; i++) {
            const prediction = tf.dot(U, I)


            let eps = tf.sub(targetMatrix, prediction)
            eps = tf.mul(eps, tf.abs(targetMatrix)) // compute the error only on the known values (i.e. non zero)

            const newU = tf.add(U, tf.dot(tf.mul(this.learningRate, eps), tf.transpose(I))) // U + lr * (eps @ I.T)
            const newI = tf.add(I, tf.transpose(tf.dot(tf.mul(this.learningRate, tf.transpose(eps)), U))) // I + lr * (eps.T @ U).T

            U = newU
            I = newI

            const error = tf.mean(tf.abs(eps))

            // if error is nan, stop training
            if (tf.isNaN(error)) {
                break
            }

            if (tf.abs(tf.sub(oldError, error)).dataSync()[0] < 1e-5) {
                this.converged = true
                break
            }

            oldError = error
        }

        this.U = U
        this.I = I

        // Final prediction is scaled with a sigmoid function to make it [-1, 1]
        let prediction = scaledSigmoid(tf.dot(U, I), 3)
        // the prediction is also adjusted by the prior, i.e a uniform distribution with mean at 0.
        prediction = tf.mul(prediction, 0.5)

        // R + U@I * (1 - np.abs(R))
        prediction = tf.add(targetMatrix, tf.mul(prediction, tf.sub(1, tf.abs(targetMatrix))))

        return prediction
    }


}

module.exports = { MatrixFactorization }