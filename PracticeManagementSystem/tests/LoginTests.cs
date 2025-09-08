using Microsoft.Playwright;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using PracticeManagementSystem.Pages;
using PracticeManagementSystem.Utils;
using System;
using System.Threading.Tasks;


namespace PracticeManagementSystem.Tests
{
    [TestClass]
    public class LoginTests : TestBase
    {
        [TestMethod]
        public async Task User_Can_Login_With_Valid_Credentials()
        {
            var loginPage = new LoginPage(_page);
            await loginPage.NavigateAsync(ConfigManager.BaseUrl);
            await loginPage.LoginAsync(ConfigManager.Username, ConfigManager.Password);

            var homePage = new HomePage(_page);
            // Wait for the home page to be visible
            await homePage.WaitForHomePageAsync();

            Assert.IsTrue(await homePage.IsHomePageVisibleAsync(), "Home page did not load after login.");
        }



        [TestMethod]
        public async Task User_Can_Logout_Successfully()
        {
            var loginPage = new LoginPage(_page);
            await loginPage.NavigateAsync(ConfigManager.BaseUrl);
            await loginPage.LoginAsync(ConfigManager.Username, ConfigManager.Password);

            var homePage = new HomePage(_page);
            await homePage.WaitForHomePageAsync();
            Assert.IsTrue(await homePage.IsHomePageVisibleAsync(), "Home page did not load after login.");

            await homePage.LogoutAsync();

            // Verify user lands on /home after logout
            StringAssert.Contains(_page.Url, "/home", "User was not redirected to the home page after logout.");
        }



    }
}