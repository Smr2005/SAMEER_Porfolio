from flask import Flask, render_template, request, jsonify, send_from_directory
from dotenv import load_dotenv
import os
import smtplib
from email.message import EmailMessage
import base64
import requests



# === Load .env Variables ===
load_dotenv()

app = Flask(__name__)

# === Routes ===
@app.route('/')
def index():
    return render_template('index.html')

# === Resume Request Form Handler ===
import requests
import os
from flask import request, render_template
from email.message import EmailMessage

@app.route('/request_resume', methods=["POST"])
def request_resume():
    name = request.form.get("name")
    email = request.form.get("email")

    if not name or not email:
        return "<h3>❌ Please fill in all fields.</h3>"

    api_key = os.getenv("BREVO_API_KEY")
    if not api_key:
        return "<h3>❌ Brevo API key not found in environment variables.</h3>"

    approve_link = f"https://sameer-porfolio.onrender.com/approve_resume?email={email}&name={name}"
    deny_link = f"mailto:{email}?subject=Regarding%20Resume%20Request"

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

    data = {
        "sender": {"email": "shaiksameershubhan@gmail.com", "name": "Sameer Portfolio"},
        "to": [{"email": "shaiksameershubhan@gmail.com"}],
        "subject": "📥 Resume Access Request via Portfolio",
        "htmlContent": html_content
    }

    try:
        r = requests.post(
            "https://api.sendinblue.com/v3/smtp/email",
            headers={"api-key": api_key, "Content-Type": "application/json"},
            json=data,
            timeout=10
        )
        if r.status_code == 201:
            return render_template('resume_success.html', name=name, email=email)
        else:
            return f"<h3>❌ Brevo API error: {r.status_code} - {r.text}</h3>"
    except Exception as e:
        return f"<h3>❌ Failed to send via Brevo API: {str(e)}</h3>"


import os
import base64
import requests
from flask import request, render_template

@app.route('/approve_resume')
def approve_resume():
    hr_email = request.args.get("email")
    name = request.args.get("name")

    api_key = os.getenv("BREVO_API_KEY")
    if not api_key:
        return "<h3>❌ Brevo API key missing in environment variables.</h3>"

    resume_path = "static/resume/sameer_resume.pdf"

    if not os.path.exists(resume_path):
        return "<h3>❌ Resume file not found. Please upload it to /static/resume/</h3>"

    # Load and encode resume as Base64
    with open(resume_path, "rb") as f:
        pdf_base64 = base64.b64encode(f.read()).decode()

    cold_email = f"""
    Dear {name},

    Thank you for showing interest in connecting with me!

    I'm glad to share my resume with you. I hold a strong foundation in AI & Data Science and have applied my skills to projects in facial recognition, disease prediction, and IoT systems.

    Attached is my resume for your review. I look forward to hearing about any opportunities where I can contribute and grow.

    Please feel free to get in touch with any questions!

    Warm regards,  
    Sameer Shaik  
    AI & Data Science Developer  
    📧 shaiksameershubhan@gmail.com  
    🔗 LinkedIn: https://www.linkedin.com/in/shaik-sameer-69a342a8  
    💻 GitHub: https://github.com/Smr2005
    """

    # Prepare Brevo API payload
    data = {
        "sender": {"email": "shaiksameershubhan@gmail.com", "name": "Sameer Shaik"},
        "to": [{"email": hr_email, "name": name}],
        "subject": "📎 Resume from Sameer Shaik",
        "textContent": cold_email,
        "attachment": [
            {
                "content": pdf_base64,
                "name": "Sameer_Shaik_Resume.pdf"
            }
        ]
    }

    try:
        # Send via Brevo REST API
        response = requests.post(
            "https://api.sendinblue.com/v3/smtp/email",
            headers={
                "api-key": api_key,
                "Content-Type": "application/json"
            },
            json=data,
            timeout=10
        )

        if response.status_code == 201:
            try:
                return render_template('resume_sent.html', email=hr_email, name=name)
            except Exception as template_error:
                return f"<h3>✅ Resume sent successfully to {hr_email}! <br><small>Template Error: {template_error}</small></h3>"
        else:
            return f"<h3>❌ Failed to send via Brevo API: {response.status_code} - {response.text}</h3>"

    except Exception as e:
        return f"<h3>❌ Network or API Error: {str(e)}</h3>"



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





