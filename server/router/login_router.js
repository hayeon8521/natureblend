const express = require('express');
const session = require('express-session');	
const fileStore = require('session-file-store')(session);
const router = express.Router();
const loginService = require('../service/login_service.js');


const cors = require('cors');

router.use(cors({
  origin: 'http://localhost:8081', // Vue.js 클라이언트의 주소
  credentials: true // 세션을 쿠키로 전송할 수 있게 설정
}));

router.use(session({
  secret: 'secret key',	//암호화하는 데 쓰일 키
  resave: false,	// 세션에 변경사항이 없어도 항상 다시 저장할지 여부
  saveUninitialized: true,	// 초기화되지 않은 세션을 스토어(저장소)에 강제로 저장할지 여부
  cookie: {	//세션 쿠키 설정 (세션 관리 시 클라이언트에 보내는 쿠키)
    httpOnly: true, // true 이면 클라이언트 자바스크립트에서 document.cookie로 쿠키 정보를 볼 수 없음
    secure: false, // true 이면 https 환경에서만 쿠키 정보를 주고 받도록 처리, 서비스 시작하면 ture로 변경해야함
    maxAge: 600000 // 쿠키가 유지되는 시간 (밀리세컨드 단위)
  },
  store: new fileStore() // 세션 저장소로 fileStore 사용
}));

router.get('/loginconfig', (req, res) => {
    if (req.session.is_logined) {
        res.send({
            emp_num: req.session.emp_num,
            name: req.session.name,
            tel: req.session.tel,
        });
    } else {
        res.send({ message: "로그인되지 않음" });
    }

    // if (req.session.num === undefined) 
    //   req.session.num = 1;
    // else
    //   req.session.num += 1;
    // res.send(`${req.session.num}번 접속`);
  });
  

// 로그인 요청시 사용자 정보 확인 후 세션에 사용자 정보 저장
router.post('/login', async (req, res) => {
    const {empnum, password} = req.body;
    console.log('aaabbbb');
    console.log(empnum,password);
    let login = await loginService.loginInfo(empnum,password);
    // res.send(login);

    console.log(login);
    console.log(login);
    console.log(login);
    console.log(login[0]);
    if(login[0]){
        req.session.emp_num = login[0].emp_num;
        req.session.name = login[0].name;
        req.session.birth = login[0].birth;
        req.session.tel = login[0].tel;
        req.session.job = login[0].job;
        req.session.job_num = login[0].job_num;
        req.session.position = login[0].position;
        req.session.employment_date = login[0].employment_date;
        req.session.resignation_date = login[0].resignation_date;
        req.session.level = login[0].level;
        req.session.is_logined = true; 
        req.session.save(err => {
            if (err) {
                console.error('세션 저장 오류:', err);
                res.status(500).send('세션 저장 오류');
                console.log('3333');
                return;
            }
            // res.redirect('/home');
            res.send(login);
            console.log('eeee');
        });
    }else{
        console.log('1111');
        res.send('아이디 또는 비밀번호가 잘못되었습니다.');
        // res.status(401).send('아이디 또는 비밀번호가 잘못되었습니다.');
    }
});
// 로그아웃 요청시 세션 삭제 후 로그인 페이지로 이동
router.post('/logout', async(req, res) => {
    console.log('연결');
    req.session.destroy(); // destroy() 함수를 사용해서 세션 삭제
    res.send('로그아웃');
});
    // // 데이터베이스의 사용자 테이블에서 로그인 인증 처리 코드 작성
    // // 사용자가 존재하면(로그인 처리가 성공하면)
    // req.session.email = email; // 세션에 사용자 이메일 정보 저장
    // req.session.is_logined = true; // 세션에 로그인 여부 저장
    // req.session.save(err => { // 세션 저장
    //   if(err) throw err;
    //   res.redirect('/home'); // 로그인 후 홈화면으로 이동
    // });



module.exports = router;