using Microsoft.Playwright;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using System.Threading.Tasks;

namespace PracticeManagementSystem.Utils
{
    public class TestBase
    {
        protected static IPlaywright _playwright;
        protected static IBrowser _browser;
        protected IPage _page;
        protected IBrowserContext _context;

        [ClassInitialize(InheritanceBehavior.BeforeEachDerivedClass)]
        public static async Task ClassInit(TestContext context)
        {
            _playwright = await Playwright.CreateAsync();
            _browser = await _playwright.Chromium.LaunchAsync(new BrowserTypeLaunchOptions
            {
                Headless = false
            });
        }

        [TestInitialize]
        public async Task TestInit()
        {
            _context = await _browser.NewContextAsync();
            _page = await _context.NewPageAsync();
        }

        [TestCleanup]
        public async Task TestCleanup()
        {
            await _context.CloseAsync();
        }

        [ClassCleanup(InheritanceBehavior.BeforeEachDerivedClass)]
        public static async Task ClassCleanup()
        {
            await _browser.CloseAsync();
            _playwright.Dispose();
        }
    }
}
