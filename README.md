# bento_post

## 概要
弁当注文用のスクリプトです．
GASによって書かれています．

基本的なコマンドを以下に示します．

## 使い方

`order [option] [value]`

### options

 `-d MMDD [ifn]{1}`

 MM月DD日の注文内容を設定する

 `-w [ifn]{6}`

 次週(Mon~Sat)の注文内容を設定する

 `-a [ifn]{1}`

 自動注文設定(カレンダーの昼食会に合わせて自動設定)をON/OFFする


 i : いこい

 f : ふじ

 n : なし(削除)

### examples

 `order -d 0512 f`

 5月12日にふじを注文

 `order -w ifnnnn`

 `order -w if`

 次週，月曜から順にいこい，ふじ，なし，なし，なし，なしとして注文(どちらも同じ)

 `order -a i`

 次週以降，昼食会が設定されている日にいこいを自動注文するフラグをON
 
 すでにONならOFFにする

## etc
 
 各command送信後はSlackbotから必ず返信がありますのでご確認ください．
 不都合等あれば私のDMまでお願いいたします．
