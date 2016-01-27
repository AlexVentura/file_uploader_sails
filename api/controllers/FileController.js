/**
 * FileController
 *
 * @description :: Server-side logic for managing files
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

 module.exports = {

	/**
	 * `FileController.upload()`
	 * POST http://localhost:1337/file/upload
	 * Upload file(s) to the server's disk.
	 */

	upload: function (req, res) {
		// e.g.
		// 0 => infinite
		// 240000 => 4 minutes (240,000 miliseconds)
		// etc.
		//
		// Node defaults to 2 minutes.
		res.setTimeout(0);

		// Parametro que se envia en la peticion post
		req.file('attachedFile')
		.upload({

		  // You can apply a file upload limit (in bytes)
		  // maxBytes: 1000000
		  // adapter: require('skipper-disk') or adapter: require('skipper-s3'),
		  // dirname: require('path').resolve(sails.config.appPath, '/assets/images')

		}, function whenDone (err, uploadedFiles) {
			if (err) return res.serverError(err);
			else {
				console.log('*_*_*_*_*_*_*_*_*_*_*_*_*', uploadedFiles[0].filename);
				return res.json({
					files: uploadedFiles,
					textParams: req.params.all()
				});
			}
		});
	},

	/**
	 * `FileController.s3upload()`
	 *
	 * Upload file(s) to an S3 bucket.
	 *
	 * NOTE:
	 * If this is a really big file, you'll want to change
	 * the TCP connection timeout.  This is demonstrated as the
	 * first line of the action below.
	 */
	s3upload: function (req, res) {
		// e.g.
		// 0 => infinite
		// 240000 => 4 minutes (240,000 miliseconds)
		// etc.
		//
		// Node defaults to 2 minutes.
		res.setTimeout(0);

		req.file('filepath').upload({
			adapter: require('skipper-s3'),
			bucket: process.env.BUCKET,
			key: process.env.KEY,
			secret: process.env.SECRET
		}, function whenDone(err, uploadedFiles) {
			if (err) return res.serverError(err);
			else return res.json({
				files: uploadedFiles,
				textParams: req.params.all()
			});
		});
	},


	/**
	 * FileController.download()
	 *
	 * Download a file from the server's disk.
	 */
	download: function (req, res) {
		require('fs').createReadStream(req.param('path'))
		.on('error', function (err) {
			return res.serverError(err);
		})
		.pipe(res);
	}

};
