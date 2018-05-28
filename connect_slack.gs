//doPostで受け取ったメッセージを解析
function doPost(e) {
  if (VERIFY_TOKEN != e.parameter.token) {
    throw new Error("invalid token.");
  }
  
  //受信メッセージをmessageとuserに分割する
  var reception = e.parameter.text.replace(/^ /, "");
  var send_user = e.parameter.user_name;
  
  //受信メッセージ(reception)からcommandを読み取り，各動作を行う
  switch (true) {
    //order（日付指定）
    case /^order\s-d\s\d{4}\s[ifn]{1}/.test(reception):
      spot_order(reception, send_user);
      break;
    case /^order\s-w\s[ifn]+/.test(reception):
      weekly_order(reception, send_user);
      break;
    case /^order\s-a\s[ifn]{1}/.test(reception):
      auto_order(reception, send_user);
      break;
    //help message(usage)
    case /^help/.test(reception):
      post_slack(SLACK_ACCESS_TOKEN, '@' + send_user, USAGE, 'usage');
      break;
    case /^check/.test(reception):
      reading_order(send_user);
      break;
    default:
      post_slack(SLACK_ACCESS_TOKEN, '@' + send_user, ERROR, 'usage');
      break;
  }
}

function weekly_order(reception, username) {
  var value = reception.split(" ")[2];
  write_sheet(value, username);
  post_slack(SLACK_ACCESS_TOKEN, '@' + username, 'ordering_complete.', 'ordering_bot');
  reading_order(username);
}

function spot_order(reception, username) {
  var value = reception.split(" ")[3];
  var setday = reception.split(" ")[2];
  post_slack(SLACK_ACCESS_TOKEN, '@' + username, 'ordering_complete.', 'ordering_bot');
  write_sheet_ano(setday, value, username);
}

function auto_order(reception, username) {
  var value = reception.split(" ")[2];
  var ret = write_sheet_auto(value, username);
  post_slack(SLACK_ACCESS_TOKEN, '@' + username, 'auto_order flag is ' + ret + '.', 'ordering_bot');
}

function post_slack (access_token, channel, message, botname) {
  var slackApp = SlackApp.create(access_token); 
  
  //Send Message to Slack
  slackApp.chatPostMessage(channel, message, {
    username : botname,
  });
}