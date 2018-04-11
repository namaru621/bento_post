//週毎に設定したトリガーでリマインド通知

function weekly_post() {
  var slackApp = SlackApp.create(SLACK_ACCESS_TOKEN);
  var channelId = "@namaru621";
  var message = "Please, ordering lunch.";
  var options = {
    username: "lunch_bot"
  }
  slackApp.postMessage(channelId, message, options)
}
