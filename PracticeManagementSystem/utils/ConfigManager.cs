using Microsoft.Extensions.Configuration;
using System.IO;

namespace PracticeManagementSystem.Utils
{
    public static class ConfigManager
    {
        private static IConfigurationRoot config;

        static ConfigManager()
        {
            var builder = new ConfigurationBuilder()
                .SetBasePath(Directory.GetCurrentDirectory())
                .AddJsonFile("Config/appsettings.json", optional: false, reloadOnChange: true);
            config = builder.Build();
        }

        public static string BaseUrl => config["BaseUrl"];
        public static string Username => config["Username"];
        public static string Password => config["Password"];

    }
}