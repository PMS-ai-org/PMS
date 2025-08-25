using Microsoft.Playwright;
using PracticeManagementSystem.Pages;
using System.Threading.Tasks;

public class HomePage : BasePage
{
    private const string LogoutButtonSelector = "button.logout-btn";

    // More specific selector, matches only the span with text 'Patient Portal'
    private const string HomeHeaderSelector = "span.app-title:has-text('Patient Portal')";

    private readonly ILocator _logoutButton;
    private readonly ILocator _homeHeader;

    public HomePage(IPage page) : base(page)
    {
        _logoutButton = page.Locator(LogoutButtonSelector);
        _homeHeader = page.Locator(HomeHeaderSelector);
    }

    public async Task LogoutAsync()
    {
        await _logoutButton.ClickAsync();
        await page.WaitForURLAsync(url => url.Contains("/home"), new PageWaitForURLOptions { Timeout = 20000 });
    }

    public async Task WaitForHomePageAsync()
    {
        await _homeHeader.WaitForAsync(new LocatorWaitForOptions { State = WaitForSelectorState.Visible, Timeout = 15000 });
    }

    public Task<bool> IsHomePageVisibleAsync() => _homeHeader.IsVisibleAsync();
}
