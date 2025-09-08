using Microsoft.Playwright;
using System.Threading.Tasks;

namespace PracticeManagementSystem.Pages
{
    /// <summary>
    /// Represents the dashboard page and its interactions.
    /// </summary>
    public class DashboardPage : BasePage
    {
        // Selector constants
        private const string LogoutButtonSelector = "#btnSignOut";
        private const string ConfirmYesButtonSelector = "#btnOK";
        private const string DashboardHeaderSelector = ".userDashboard";

        // Locators
        private readonly ILocator _logoutButton;
        private readonly ILocator _confirmYesButton;
        private readonly ILocator _dashboardHeader;

        public DashboardPage(IPage page) : base(page)
        {
            _logoutButton = page.Locator(LogoutButtonSelector);
            _confirmYesButton = page.Locator(ConfirmYesButtonSelector);
            _dashboardHeader = page.Locator(DashboardHeaderSelector);
        }

        /// <summary>
        /// Logs the user out by clicking the logout button and confirming.
        /// </summary>
        public async Task LogoutAsync()
        {
            await _logoutButton.ClickAsync();

            // wait for confirmation popup
            await _confirmYesButton.WaitForAsync(new LocatorWaitForOptions { State = WaitForSelectorState.Visible });
            await _confirmYesButton.ClickAsync();

            // wait until redirected to ADFS login page
            await page.WaitForURLAsync(url => url.Contains("adfs/ls"), new PageWaitForURLOptions { Timeout = 20000 });
        }


        /// <summary>
        /// Verifies that the dashboard page is loaded.
        /// </summary>
        public Task<bool> IsDashboardVisibleAsync() => _dashboardHeader.IsVisibleAsync();
    }
}
