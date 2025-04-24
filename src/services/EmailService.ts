import nodemailer from "nodemailer";
import moment from "moment";
// Cấu hình email sender (dùng Gmail làm ví dụ)
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "quang05012003@gmail.com", // Email của bạn
    pass: "uhuk esto piva rwbs", // Mật khẩu hoặc App Password (nếu bật 2FA)
  },
});

export async function sendAppointmentConfirmation(
  customerEmail: string,
  name: string,
  appointmentDate: Date
): Promise<void> {
  const mailOptions = {
    from: '"Hệ thống đặt lịch" <quang05012003@gmail.com>',
    to: customerEmail,
    subject: "Xác nhận lịch hẹn",
    html: `<h2>Xin chào ${name},</h2>
             <p>Bạn đã đặt lịch hẹn vào ngày <strong>${moment(
               appointmentDate
             ).format("MMMM Do YYYY")}</strong>.</p>
             <p>Vui lòng bấm vào đường link sau để xác nhận yêu cầu.</p>
             <p>Cảm ơn bạn đã sử dụng dịch vụ của chúng tôi!</p>`,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent: " + info.response);
  } catch (error) {
    console.error("Lỗi khi gửi email:", error);
  }
}
