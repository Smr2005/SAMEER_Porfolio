from flask import Flask, render_template, request, jsonify, send_from_directory
from dotenv import load_dotenv
import os
import smtplib
from email.message import EmailMessage

# === Load .env Variables ===
load_dotenv()

app = Flask(__name__)

# === Routes ===
@app.route('/')
def index():
    return render_template('index.html')

# === Resume Request Form Handler ===
@app.route('/request_resume', methods=["POST"])
def request_resume():
    name = request.form.get("name")
    email = request.form.get("email")

   if not name or not email:
        return "<h3>❌ Please fill in all fields.</h3>"

    sender_email = os.getenv("SENDER_EMAIL")
    sender_password = os.getenv("SENDER_PASSWORD")
    smtp_server = os.getenv("SMTP_SERVER", "smtp-relay.sendinblue.com")
    smtp_port = int(os.getenv("SMTP_PORT", 587))

    approve_link = f"https://sameer-porfolio.onrender.com/approve_resume?email={email}&name={name}"
    deny_link = f"mailto:{email}?subject=Regarding%20Resume%20Request&body=Hi%20{name},%20thank%20you%20for%20your%20interest.%20Currently%20I’m%20unable%20to%20share%20my%20resume.%20Regards,%20Sameer"

    # Compose the HTML message
    html_content = f"""
    <html>
      <body style="font-family: Arial; background-color: #f4f4f4; padding: 20px;">
        <h2>📄 New Resume Access Request</h2>
        <p><strong>👤 Name:</strong> {name}</p>
        <p><strong>📧 Email:</strong> {email}</p>
        <p>👉 Choose how you want to respond:</p>
        <a href="{approve_link}" style="background-color:#0ef;color:#000;padding:12px 22px;text-decoration:none;border-radius:6px;font-weight:bold;margin-right:10px;">✅ Approve & Send Resume</a>
        <a href="{deny_link}" style="background-color:#ff4d4d;color:#fff;padding:12px 22px;text-decoration:none;border-radius:6px;font-weight:bold;">❌ Deny Request</a>
        <br><br>
        <p style="font-size: 0.85rem; color: #777;">This message was generated automatically from your portfolio website.</p>
      </body>
    </html>
    """

    msg = EmailMessage()
    msg['Subject'] = "📥 Resume Access Request via Portfolio"
    msg['From'] = sender_email
    msg['To'] = recipient_email
    msg.set_content(f"New resume request from {name} ({email}).")
    msg.add_alternative(html_content, subtype="html")

    try:
        server = smtplib.SMTP_SSL("smtp.gmail.com", 465)
        server.login(sender_email, sender_password)
        server.send_message(msg)
        server.quit()
        try:
            return render_template('resume_success.html', name=name, email=email)
        except Exception as template_error:
            return f"<h3>✅ Thank you {name}! Sameer will respond shortly to {email}. <br><small>Template Error: {str(template_error)}</small></h3>"
    except Exception as e:
        return f"<h3>❌ Error sending notification email: {str(e)}</h3>"


# === Resume Approval Route ===
@app.route('/approve_resume')
def approve_resume():
    hr_email = request.args.get("email")
    name = request.args.get("name")

    sender_email = os.getenv("SENDER_EMAIL")
    sender_password = os.getenv("SENDER_PASSWORD")

    resume_path = "static/resume/sameer_resume.pdf"

    cold_email = f"""
Dear {name},

Thank you for showing interest in connecting with me!

I’m glad to share my resume with you. I hold a strong foundation in AI & Data Science and have applied my skills to projects in facial recognition, disease prediction, and IoT systems.

Attached is my resume for your review. I look forward to hearing about any opportunities where I can contribute and grow.

Please feel free to get in touch with any questions!

Warm regards,  
Sameer Shaik  
AI & Data Science Developer  
📧 shaiksameershubhan@gmail.com  
🔗 LinkedIn: https://www.linkedin.com/in/shaik-sameer-69a3422a8  
💻 GitHub: https://github.com/Smr2005
    """

    msg = EmailMessage()
    msg['Subject'] = "📎 Resume from Sameer Shaik"
    msg['From'] = sender_email
    msg['To'] = hr_email
    msg.set_content(cold_email)

    try:
        with open(resume_path, "rb") as f:
            msg.add_attachment(
                f.read(),
                maintype="application",
                subtype="pdf",
                filename="Sameer_Shaik_Resume.pdf"
            )
    except FileNotFoundError:
        return "<h3>❌ Resume file not found. Please upload it to /static/resume/</h3>"

    try:
        server = smtplib.SMTP_SSL("smtp.gmail.com", 465)
        server.login(sender_email, sender_password)
        server.send_message(msg)
        server.quit()
        try:
            return render_template('resume_sent.html', email=hr_email, name=name)
        except Exception as template_error:
            return f"<h3>✅ Resume sent successfully to {hr_email}! <br><small>Template Error: {str(template_error)}</small></h3>"
    except Exception as e:
        return f"<h3>❌ Failed to send resume: {str(e)}</h3>"


# === Favicon Routes ===
@app.route('/favicon.ico')
def favicon():
    return send_from_directory('static/images', 'favicon.ico')

@app.route('/static/images/favicon-32x32.png')
def favicon32():
    return send_from_directory('static/images', 'favicon-32x32.png')

@app.route('/static/images/favicon-16x16.png')
def favicon16():
    return send_from_directory('static/images', 'favicon-16x16.png')

# === Start Server ===
if __name__ == "__main__":
    app.run(debug=True)

