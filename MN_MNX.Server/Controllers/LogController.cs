using DBreeze.Utils;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MN_MNX.Server.Models;

namespace MN_MNX.Server.Controllers
{
    [Route("log")]
    [ApiController]
    public class LogController(UserContext userContext) : ControllerBase
    {
        [Authorize(Roles = "Admin")]
        [HttpGet]
        public ActionResult<string> Get()
        {
            var content = string.Empty;
            try
            {
                var bodyContent = string.Empty;

                var logFilePaths = Directory.GetFiles($"{Environment.CurrentDirectory}/Logs");

                foreach (var path in logFilePaths)
                {
                    using (var reader = new StreamReader(path))
                    {
                        while (!reader.EndOfStream)
                        {
                            var line = reader.ReadLine();
                            var values = line.Split(';');

                            var date = string.Empty;
                            var source = string.Empty;
                            var message = string.Empty;

                            for (int i = 0; i < values.Length; i++)
                            {
                                switch (i)
                                {
                                    case 0:
                                        date = values[i];
                                        break;
                                    case 1:
                                        source = values[i];
                                        break;
                                    case 2:
                                        message = values[i];
                                        break;
                                }
                            }

                            bodyContent = $"<tr>" +
                                $"<td>{date}</td>" +
                                $"<td>{source}</td>" +
                                $"<td>{message}</td>" +
                                $"</tr>" + bodyContent;
                        }
                    }
                }

                var replaces = new Dictionary<string, string>
                {
                    { "{@UserName}", userContext.User.GetUserFullName() },
                    { "{@LogTableBody}", bodyContent }
                };

                var logTable = System.IO.File.ReadAllText($"{Environment.CurrentDirectory}/Assets/LogTable.html");

                content = logTable?.ReplaceMultiple(replaces) ?? string.Empty;
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
            }
            return base.Content(content, "text/html");
        }
    }
}
