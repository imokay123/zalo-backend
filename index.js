import express from "express";
import axios from "axios";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

const ZALO_TOKEN = "Wguv5y7Q7161eZCMpTeN48ocFXBDnGzS_Rb4FyAC4JdUftrYmOqYE_ciU6FBWYS7vur-GUQrDLYgj4CEfCmF2RF8SacqvoHBY_m12P3RKcs2-GGUfPbr4vcp2s2NkouClBf5T9cwRdEfm40-YxrbRuwzIYZEaonbyRrPCFUR46knvsOmYEGpJPRUO12ln4LrwhbjSQlD7Z3do6jArBHFAVRD86p7uGzeu9KhDzAKVrEIjn0Kbvj_GusJ6YwEb3H2k9XbEw3ZBtVisMSCgSODVwlWOmc6wHuEbE1dOz2PJG_kx7nmnUunSFRR7nVGx4jQqlOTDj_PPLUQrG4IYCrUSRRqANVmz7yEj8alTg6dOWg_dZTHdFvjLLDqJHmqmiqK5W"; // Thay bằng token Zalo thật

app.post("/send-zalo", async (req, res) => {
  const { name, phone, time, zalo_user_id } = req.body;

  if (!name || !phone || !time || !zalo_user_id) {
    return res.status(400).json({ error: "Thiếu thông tin" });
  }

  const message = `Cảm ơn ${name} đã đặt lịch lúc ${time}. SĐT: ${phone}`;

  try {
    const response = await axios.post(
      "https://openapi.zalo.me/v3.0/oa/message",
      {
        recipient: { user_id: zalo_user_id },
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
    console.error(error.response?.data || error.message);
    res.status(500).json({ error: "Lỗi gửi Zalo" });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Zalo server chạy ở http://localhost:${PORT}`));
