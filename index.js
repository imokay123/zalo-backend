import express from "express";
import axios from "axios";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

const ZALO_TOKEN = process.env.ZALO_TOKEN; // Dùng biến môi trường cho an toàn
const ZALO_USER_ID = process.env.ZALO_USER_ID; // Bạn đặt trong Environment Variables của Render

app.post("/send-zalo", async (req, res) => {
  const { name, phone, date, time, service } = req.body;

  if (!name || !phone || !date || !time || !service) {
    return res.status(400).json({ error: "Thiếu thông tin" });
  }

  const message = `
[Zin Spa] Có đơn đặt lịch mới:
- Khách: ${name}
- SĐT: ${phone}
- Dịch vụ: ${service}
- Ngày: ${date}
- Giờ: ${time}
  `;

  try {
    const response = await axios.post(
      "https://openapi.zalo.me/v3.0/oa/message",
      {
        recipient: { user_id: ZALO_USER_ID },
        message: { text: message },
      },
      {
        headers: {
          "access_token": ZALO_TOKEN,
          "Content-Type": "application/json",
        },
      }
    );

    res.json({ success: true, zalo: response.data });
  } catch (error) {
    console.error("Zalo API error:", error.response?.data || error.message);
    res.status(500).json({ error: "Lỗi gửi tin nhắn Zalo" });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
