const express = require('express');
const cors = require('cors');
const fs = require('fs');
const snarkjs = require('snarkjs');

const app = express();

// 1. CORS 설정: 내 깃허브 페이지 주소만 허용하도록 수정 (보안 강화)
app.use(cors({
    origin: "https://yonseizk.github.io"
}));

app.use(express.json());

const vKey = JSON.parse(fs.readFileSync("./verification_key.json", "utf-8"));

app.post('/verify-proof', async (req, res) => {
  try {
    const { proof, publicSignals } = req.body;
    const isValid = await snarkjs.groth16.verify(vKey, publicSignals, proof);
    console.log(`[결과] 인증 ${isValid ? "성공" : "실패"}`);
    res.json({ success: isValid });
  } catch (e) {
    res.status(500).json({ success: false, error: e.message });
  }
});

// 2. 포트 설정: Render가 제공하는 환경 변수(PORT)를 쓰도록 수정
// 3000번으로 고정하면 Render에서 서버가 안 뜰 수 있습니다.
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`✅ 검증 서버 구동 중 (Port: ${PORT})`));