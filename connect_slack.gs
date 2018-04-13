//doPostで受け取ったメッセージを解析
function doPost(e) {
  if (VERIFY_TOKEN != e.parameter.token) {
    throw new Error("invalid token.");
  }
  
  //受信メッセージをスペース区切りでcommandとvalueに分割する
  var reception = e.parameter.text.replace(/^ /, "");
  var send_user = e.parameter.user_name;
  
  //受信メッセージ(command value)からcommandを読み取り，各動作を行う
  switch (true) {
    case /^order\s[ifc]{6}/.test(reception):
      order(reception, send_user);
      break;
    //help message(usage)
    case /^help/.test(reception):
      post_slack(SLACK_ACCESS_TOKEN, send_user, USAGE, 'usage');
      break;
    default:
      post_slack(SLACK_ACCESS_TOKEN, send_user, ERROR, 'usage');
      break;
  }
}

function order(reception, username) {
  var com = reception.split(" ")[0]
  var value = reception.split(" ")[1]
  write_sheet(value, username);
}

function order_test(){
  order("order iiffii", "namaru621");
}


function post_slack (access_token, channel, message, botname) {
  var slackApp = SlackApp.create(access_token); 
  
  //Send Message to Slack
  slackApp.chatPostMessage(channel, message, {
    username : botname,
  });
}