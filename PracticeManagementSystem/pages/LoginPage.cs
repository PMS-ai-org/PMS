using Microsoft.Playwright;
using System;
using System.Threading.Tasks;

namespace PracticeManagementSystem.Pages
{
    /// <summary>
    /// Represents the login page and its interactions.
    /// </summary>
    public class LoginPage : BasePage
    {
        // Selector constants
        private const string UsernameSelector = "input[formcontrolname='username']";
        private const string PasswordSelector = "input[formcontrolname='password']";
        private const string SubmitButtonSelector = "button[type='submit']:has-text('Login')";
        private const string FuseLogoSelector = "#fuseLogo";
        private const string ErrorMessageSelector = "#errorText";

        // Locators
        private readonly ILocator _usernameInput;
        private readonly ILocator _passwordInput;
        private readonly ILocator _submitButton;
        private readonly ILocator _fuseLogo;
        private readonly ILocator _errorMessage;

        public LoginPage(IPage page) : base(page)
        {
            _usernameInput = page.Locator(UsernameSelector);
            _passwordInput = page.Locator(PasswordSelector);
            _submitButton = page.Locator(SubmitButtonSelector);
            _fuseLogo = page.Locator(FuseLogoSelector);
            _errorMessage = page.Locator(ErrorMessageSelector);
        }

        /// <summary>
        /// Navigates to the specified URL.
        /// </summary>
        public async Task NavigateAsync(string url)
        {
            if (string.IsNullOrWhiteSpace(url))
                throw new ArgumentException("URL cannot be null or empty.", nameof(url));

            await page.GotoAsync(url);
        }

        /// <summary>
        /// Performs login with the provided credentials (can be empty for negative tests).
        /// </summary>
        public async Task LoginAsync(string username, string password)
        {
            await _usernameInput.FillAsync(username ?? string.Empty);
            await _passwordInput.FillAsync(password ?? string.Empty);
            await _submitButton.ClickAsync();
        }

        /// <summary>
        /// Checks if login was successful by verifying the Fuse logo is visible.
        /// </summary>
        public Task<bool> IsLoginSuccessfulAsync() => _fuseLogo.IsVisibleAsync();

        /// <summary>
        /// Gets the error message text if visible.
        /// </summary>
        public async Task<string> GetErrorMessageAsync()
        {
            if (await _errorMessage.IsVisibleAsync())
                return await _errorMessage.InnerTextAsync();
            return string.Empty;
        }
    }
}
