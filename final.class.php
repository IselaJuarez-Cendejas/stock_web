<?php 
class final_rest
{



/**
 * @api  /api/v1/setTemp/
 * @apiName setTemp
 * @apiDescription Add remote temperature measurement
 *
 * @apiParam {string} location
 * @apiParam {String} sensor
 * @apiParam {double} value
 *
 * @apiSuccess {Integer} status
 * @apiSuccess {string} message
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *              "status":0,
 *              "message": ""
 *     }
 *
 * @apiError Invalid data types
 *
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 200 OK
 *     {
 *              "status":1,
 *              "message":"Error Message"
 *     }
 *
 */

	public static function setTemp ($location, $sensor, $value)

	{
		if (!is_numeric($value)) {
			$retData["status"]=1;
			$retData["message"]="'$value' is not numeric";
		}
		else {
			try {
				EXEC_SQL("insert into temperature (location, sensor, value, date) values (?,?,?,CURRENT_TIMESTAMP)",$location, $sensor, $value);
				$retData["status"]=0;
				$retData["message"]="insert of '$value' for location: '$location' and sensor '$sensor' accepted";
			}
			catch  (Exception $e) {
				$retData["status"]=1;
				$retData["message"]=$e->getMessage();
			}
		}

		return json_encode ($retData);
	}


	/*
	CREATE TABLE 'stock' ('dateTime' DATETIME, 'stockTicker' TEXT, 'queryType' TEXT, 'jsonData' TEXT)
	*/

	public static function setStock ($stockTicker, $queryType, $jsonData)

	{
		if ((!$queryType == "detail") && (!$queryType == "news")) {
			$retData["status"]=1;
			$retData["message"]="'$queryType' is not valid";
		}
		else {
			try {
                                EXEC_SQL("insert into stock (dateTime, stockTicker, queryType, jsonData) values (CURRENT_TIMESTAMP,?,?,?)",$stockTicker, $queryType, $jsonData);
                                $retData["status"]=0;
                                $retData["message"]="insert of '$queryType' for stockTicker: '$stockTicker', queryType: '$queryType', and jsonData: '$jsonData' accepted";
			}
                        catch  (Exception $e) {
                                $retData["status"]=1;
                                $retData["message"]=$e->getMessage();
                        }
                }

                return json_encode ($retData);
	}

 	public static function getStock ($date)

 	{
    		$result = GET_SQL("select * from stock where dateTime like ? order by dateTime", $date . "%");

    		if (!$result) {
        		$retData["status"] = 1;
        		$retData["message"] = "No results found for the given date";
    		} else {
        		$retData["status"] = 0;
        		$retData["result"] = $result;
		}

    		return json_encode ($retData);
        }

}

