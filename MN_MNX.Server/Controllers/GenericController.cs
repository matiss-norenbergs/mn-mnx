using Microsoft.AspNetCore.Mvc;
using MN_MNX.Server.Helpers;
using MN_MNX.Server.ModelsJson;

namespace MN_MNX.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class GenericController : ControllerBase
    {
        [HttpGet]
        public ActionResult<IEnumerable<KeyValuePairJson>> Get()
        {
            try
            {
                var jsonData = new List<KeyValuePairJson>();

                var timeZoneCollection = GenericHelper.GetTimeZoneCollection();
                foreach (var item in timeZoneCollection)
                {
                    jsonData.Add(new KeyValuePairJson
                    {
                        Key = item.Key,
                        Value = item.Value.DisplayName
                    });
                }

                return Ok(jsonData);
            }
            catch (Exception ex)
            {
                ex.LogException();
                return BadRequest();
            }
        }
    }
}
