const fs = require('fs');
const multer = require('multer');
const path = require('path');

// 이미지 저장
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../../images')); // 저장 경로
  },
  filename: (req, file, cb) => {
    file.originalname = Buffer.from(file.originalname, 'latin1').toString('utf8'); // 한글 깨짐 수정
    cb(null, new Date().valueOf() + path.basename(file.originalname));
  }
});



const upload = multer({ storage });

// 파일 업데이트시 기존 파일 삭제 추가
const deleteImage = (imagePath) => {
  if (fs.existsSync(imagePath)) {
    fs.unlink(imagePath, (err) => {
      if (err) console.error(`Failed to delete image: ${imagePath}`, err);
      else console.log(`Deleted image: ${imagePath}`);
    });
  }
};

module.exports = {
  upload: upload.single('machineImg'),
  deleteImage
}

