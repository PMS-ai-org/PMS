using Microsoft.Playwright;
using System.Threading.Tasks;


namespace PracticeManagementSystem.Pages {
    /// <summary>
    /// Base class for all page objects. Provides common Playwright page functionality.
    /// </summary>
    public abstract class BasePage {
        /// <summary>
        /// The Playwright page instance.
        /// </summary>
        protected readonly IPage page;

        /// <summary>
        /// Initializes a new instance of the <see cref="BasePage"/> class.
        /// </summary>
        /// <param name="page">The Playwright page instance.</param>
        protected BasePage(IPage page) {
            this.page = page;
        }

        /// <summary>
        /// Waits for an element to be visible.
        /// </summary>
        /// <param name="selector">The selector of the element.</param>
        /// <returns>A task representing the wait operation.</returns>
        protected async Task WaitForElementAsync(string selector) {
            await page.WaitForSelectorAsync(selector, new() { State = WaitForSelectorState.Visible });
        }
    }
}