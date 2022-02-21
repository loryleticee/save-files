import smtplib, time

time.sleep(10)
server = smtplib.SMTP_SSL('your-smtp-here', 465)
server.login("an_adresse", "his_password")
server.sendmail(
  "sender_address",   
  "recever_address",
  "subject: Subject here \n Message Here")
server.quit()

