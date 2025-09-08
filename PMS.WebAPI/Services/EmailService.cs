using MailKit.Net.Smtp;
using MimeKit;
using Microsoft.Extensions.Options;

namespace PMS.WebAPI.Services
{
    public class SmtpSettings
    {
        public string Host { get; set; }
        public int Port { get; set; }
        public string User { get; set; }
        public string Password { get; set; }
        public string FromEmail { get; set; }
        public string FromName { get; set; }
    }

    public class EmailService : IEmailService
    {
        private readonly SmtpSettings _smtp;
        public EmailService(IOptions<SmtpSettings> smtpOptions)
        {
            _smtp = smtpOptions.Value;
        }

        public async Task SendEmailAsync(string toEmail, string subject, string htmlBody)
        {
            var msg = new MimeMessage();
            msg.From.Add(new MailboxAddress(_smtp.FromName, _smtp.FromEmail));
            msg.To.Add(MailboxAddress.Parse(toEmail));
            msg.Subject = subject;
            msg.Body = new TextPart("html") { Text = htmlBody };

            using var client = new SmtpClient();
            await client.ConnectAsync(_smtp.Host, _smtp.Port, false);
            await client.AuthenticateAsync(_smtp.User, _smtp.Password);
            await client.SendAsync(msg);
            await client.DisconnectAsync(true);
        }
    }
}
