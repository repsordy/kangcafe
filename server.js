import express from 'express';
import cors from 'cors';
import pkg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const { Pool } = pkg;
const app = express();

app.use(cors());
app.use(express.json());

// NeonDB 연결 설정
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// 로그인 API 엔드포인트
app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    const query = 'SELECT * FROM users WHERE username = $1';
    const result = await pool.query(query, [username]);

    if (result.rows.length === 0) {
      return res.status(401).json({ success: false, message: '존재하지 않는 아이디입니다.' });
    }

    const user = result.rows[0];

    // 비밀번호 검증
    if (user.password !== password) {
      return res.status(401).json({ success: false, message: '비밀번호가 일치하지 않습니다.' });
    }

    res.json({ success: true, message: '로그인 성공!', name: user.name });
  } catch (err) {
    console.error('DB 에러:', err);
    res.status(500).json({ success: false, message: '서버 에러가 발생했습니다.' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`서버가 포트 ${PORT}에서 실행 중입니다.`);
});