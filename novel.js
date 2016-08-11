// src="novel.js"
/*
小説投稿サイトやEPUB変換サイトへの形式に合うようにそれぞれ変換をする。
それぞれの形式では、表現できない形式がありかつ種類が多いので。一旦青空文庫形式に変換してからそれぞれの形式に戻すようにする。そのほうが作業量が減らせそうだから。

*/

//フォームの選択状態に応じた処理をする
/*textarea1からデータ取得
textarea2に渡す
*/
function henkan(){
	var str=document.form1.textarea1.value;
	var inputNum=document.form1.input.selectedIndex;
		switch (inputNum){
		case 0:str = NarouAozora(str);break;
		case 1:str = KakuyomuAozora(str);break;
		case 2:str = PixivAozora(str);break;
		case 3:break;
		case 4:str = BccksAozora(str);break;

	}
	var outputNum=document.form1.output.selectedIndex;
		switch (outputNum){
		case 0:str = AozraNarou(str);break;
		case 1:str = AozoraKakuyomu(str);break;
		case 2:str = AozoraPixiv(str);break;
		case 3:break;
		case 4:str = AozoraDenden(str);break;
		case 4:str = AozoraBccks(str);break;
	}
	document.form1.textarea2.value=str;
}
//なろうから青空文庫形式へ変換
/*
なろうルビは種類が多いので前処理として一つの｜漢字《ルビ》形式にまとめる。
■ルビの統一
｜(.+?)（(.+?)）
｜|(.+?)\((.+?)\)
全角半角両方
｜$1《$2》
漢字にひらがなでふりがな
(\p{Han}+?)《(\p{Hiragana}+?)》
(\p{Han}+?)\((\p{Hiragana}+?)\)
(\p{Han}+?)（(\p{Hiragana}+?)）
漢字にカタカナでふりがな
(\p{Han}+?)《(\p{Katakana}+?)》
(\p{Han}+?) \((\p{Katakana}+?)\)
(\p{Han}+?)（(\p{Katakana}+?)）
｜$1《$2》
その他
ひらがなにカタカナでふりがな
カタカナにひらがなでふりがな

Unicodeプロパティが使えない場合の正規表現
http://so-zou.jp/software/tech/programming/tech/regular-expression/meta-character/variable-width-encoding.htm
http://d.hatena.ne.jp/kazuhooku/20090723/1248309720
http://tools.m-bsys.com/data/charlist_kana.php
ひらがな：[ぁ-ゖ]
カタカナ：[ァ-ヺー]
漢字：[\x{2E80}-\x{2E99}\x{2E9B}-\x{2EF3}\x{2F00}-\x{2FD5}\x{3005}\x{3007}\x{3021}-\x{3029}\x{3038}-\x{303B}\x{3400}-\x{4DB5}\x{4E00}-\x{9FC3}\x{F900}-\x{FA2D}\x{FA30}-\x{FA6A}\x{FA70}-\x{FAD9}\x{20000}-\x{2A6D6}\x{2F800}-\x{2FA1D}]
使用している省略漢字：[\u3400-\u4DBF\u4E00-\u9FFF\uD840-\uD87F\uDC00-\uDFFF\uF900-\uFAFF]+

■ルビのエスケープ
|(やまだたろう)
｜|\|\((.+?)\)
｜|\|（(.+?)）
ルビにしたくない場合は|を置く
半角も全角両方
■傍点
ルビを処理する前にすること。
﹅や・分割している場合や一体になっている場合がある。
｜漢《﹅》｜字《﹅》　
｜.《﹅》(?=｜)
後でやる

｜漢字《﹅﹅》
｜(.+?)《﹅{2,}》
$1［＃「$1」に傍点］

｜漢《・》｜字《・》　
｜漢字《・・》
$1［＃「$1」に丸傍点］
■改ページ
【改ページ】
［＃改ページ］
*/

function NarouAozora(str){
//■傍点
//｜漢《﹅》｜字《﹅》　
//｜漢《・》｜字《・》　
/*は後でやる 何故か最小一致にならない
str = str.replace(/｜(.+?)《﹅{2,}》/mg, "$1［＃「$1」に傍点］");
str = str.replace(/｜(.+?)《・{2,}》/mg, "$1［＃「$1」に丸傍点］");
console.log("傍点="+str)
*/
//ルビの統一
str = str.replace(/\|(.+?)《(.+?)》/mg, "｜$1《$2》");
str = str.replace(/｜(.+?)（(.+?)）/mg, "｜$1《$2》");
str = str.replace(/\|(.+?)（(.+?)）/mg, "｜$1《$2》");
str = str.replace(/\|(.+?)\((.+?)\)/mg, "｜$1《$2》");
console.log("ルビの統一="+str)

//カタカナにひらがなでふりがな
str = str.replace(/([ァ-ヺー]+?)《([ぁ-ゖ]+?)》/mg, "｜$1《$2》");
str = str.replace(/([ァ-ヺー]+?) \(([ぁ-ゖ]+?)\)/mg, "｜$1《$2》");
str = str.replace(/([ァ-ヺー]+?)（([ぁ-ゖ]+?)）/mg, "｜$1《$2》");
//2重｜の取り消し
str = str.replace(/｜｜(.+?)《(.+?)》/mg, "｜$1《$2》");
console.log("カタカナにひらがなでふりがな="+str)

//ひらがなにカタカナでふりがな
str = str.replace(/([ぁ-ゖ]+?)《([ァ-ヺー]+?)》/mg, "｜$1《$2》");
str = str.replace(/([ぁ-ゖ]+?) \(([ァ-ヺー]+?)\)/mg, "｜$1《$2》");
str = str.replace(/([ぁ-ゖ]+?)（([ァ-ヺー]+?)）/mg, "｜$1《$2》");
//2重｜の取り消し
str = str.replace(/｜｜(.+?)《(.+?)》/mg, "｜$1《$2》");

//漢字にひらがなでふりがな
str = str.replace(/([\u3400-\u4DBF\u4E00-\u9FFF\uD840-\uD87F\uDC00-\uDFFF\uF900-\uFAFF]+?)《([ぁ-ゖ]+?)》/mg, "｜$1《$2》");
str = str.replace(/([\u3400-\u4DBF\u4E00-\u9FFF\uD840-\uD87F\uDC00-\uDFFF\uF900-\uFAFF]+?)\(([ぁ-ゖ]+?)\)/mg, "｜$1《$2》");
str = str.replace(/([\u3400-\u4DBF\u4E00-\u9FFF\uD840-\uD87F\uDC00-\uDFFF\uF900-\uFAFF]+?)（([ぁ-ゖ]+?)）/mg, "｜$1《$2》");
//2重｜の取り消し
str = str.replace(/｜｜(.+?)《(.+?)》/mg, "｜$1《$2》");

//漢字にカタカナでふりがな
str = str.replace(/([\u3400-\u4DBF\u4E00-\u9FFF\uD840-\uD87F\uDC00-\uDFFF\uF900-\uFAFF]+?)《([ァ-ヺー]+?)》/mg, "｜$1《$2》");
str = str.replace(/([\u3400-\u4DBF\u4E00-\u9FFF\uD840-\uD87F\uDC00-\uDFFF\uF900-\uFAFF]+?) \(([ァ-ヺー]+?)\)/mg, "｜$1《$2》");
str = str.replace(/([\u3400-\u4DBF\u4E00-\u9FFF\uD840-\uD87F\uDC00-\uDFFF\uF900-\uFAFF]+?)（([ァ-ヺー]+?)）/mg, "｜$1《$2》");
//2重｜の取り消し
str = str.replace(/｜｜(.+?)《(.+?)》/mg, "｜$1《$2》");

//ルビのエスケープ
//|(やまだたろう)
//｜(\(.+?\))
//｜(（.+?）)
//全角半角
str = str.replace(/｜(\(.+?\))/mg, "$1");
str = str.replace(/\|(\(.+?\))/mg, "$1");
str = str.replace(/｜(（.+?）)/mg, "$1");
str = str.replace(/\|(（.+?）)/mg, "$1");
console.log("ルビのエスケープ="+str)
//改ページ
str = str.replace(/【改ページ】/mg, "［＃改ページ］");
return str;
}
//カクヨムから青空文庫形式に変換
/*
■半角縦線|《》を全角に
■傍点《《(.+?)》》
$1［＃「$1」に丸傍点］
*/
function KakuyomuAozora(str){
str = str.replace(/\|(.+?)《(.+?)》/mg, "｜$1《$2》");
str = str.replace(/《《(.+?)》》/mg, "$1［＃「$1」に丸傍点］");
return str;
}

//pixivから青空文庫
/*
■改ページ
［＃改ページ］
[newpage]
■ルビ
[[rb:pixiv > ピクシブ]]
｜漢字《ルビ》
\[\[rb:(.+?) > (.+?)\]\]
｜$1《$2》
■見出し
［＃大見出し］章タイトル［＃大見出し終わり］
[chapter:章タイトル]
■挿絵
［＃「キャプション」のキャプション付きの図（ファイル名）入る］
[pixivimage:イラストID]
■リンク
[[jumpuri:タイトル > リンク先URL]]
<a href="URL">タイトル</a>
*/
function PixivAozora(str){
str = str.replace(/\[newpage\]/mg, "［＃改ページ］");
str = str.replace(/\[\[rb:(.+?) > (.+?)\]\]/mg, "｜$1《$2》");
str = str.replace(/\[chapter:(.+?)\]/mg, "［＃大見出し］$1［＃大見出し終わり］");
//挿絵とリンクは後で
return str;
}
// BCCKSから青空文庫形式に変換
// http://support.bccks.jp/faq/text_import/

function BccksAozora(str){
//見出し
str = str.replace(/^# (.+?)]/mg, "［＃大見出し］$1［＃大見出し終わり］");
str = str.replace(/^## (.+?)]/mg, "［＃中見出し］$1［＃中見出し終わり］");
str = str.replace(/^### (.+?)]/mg, "［＃小見出し］$1［＃小見出し終わり］");
//改頁
str = str.replace(/\n={3,}\n/mg, "［＃改ページ］");
//強調
//縦中横
str = str.replace(/\[tcy\](.+?)\[\/tcy\]/mg, "$1［＃「$1」は縦中横］");
//ルビ
str=AozoraRuby(str);
var str = str.replace(/｜(.+?)《(.+?)》/mg, "{$1}($2)");
// リンク
return str;
}
/*
//青空文庫から小説家になろうへの変換
/*
■ルビはいじらない
■()を|()に変換
全角半角両方
■傍点
﹅や・分割している場合や一体になっている場合がある。
｜漢《﹅》｜字《﹅》　
｜.《﹅》(?=｜)
後でやる

｜漢字《﹅﹅》
｜(.+?)《﹅{2,}》
$1［＃「$1」に傍点］

｜漢《・》｜字《・》　
｜漢字《・・》
$1［＃「$1」に丸傍点］
■改ページ
【改ページ】
［＃改ページ］
■変換できなかった注記を削除するか？
*/
function AozraNarou(str){
//()を|()に変換、全角半角両方
str = str.replace(/\((.+?)\)/mg, "|($1)");
str = str.replace(/（(.+?)）/mg, "｜（$1）");
//傍点
//str = str.replace(/(.)［＃「\1」に傍点］/mg, "｜$1《﹅》");
//str = str.replace(/(.)［＃「\1」に丸傍点］/mg, "｜$1《・》");
//後でやる
//改ページ
str = str.replace(/［＃改ページ］/mg, "【改ページ】");
return str;
}
//青空文庫からカクヨムへの変換
/*
■ルビはいじらない
■傍点の統一
○○［＃「○○」に傍点］
○○［＃「○○」に丸傍点］
《《○○ 》》
■変換できなかった注記を削除するか？
*/
function AozoraKakuyomu(str){
var str = str.replace(/(.+?)［＃「\1」に傍点］/mg, "《《$1》》");
var str = str.replace(/(.+?)［＃「\1」に丸傍点］/mg, "《《$1》》");
return str;
}
//青空文庫からpixivへの変換
/*
http://help.pixiv.net/202/
■改ページ
［＃改ページ］
[newpage]
■ルビ
[[rb:pixiv > ピクシブ]]
｜漢字《ルビ》
\[\[rb:(.+?) > (.+?)\]\]
｜$1《$2》
漢字《ルビ》　縦線がないルビをどうするか

■見出し
［＃大見出し］章タイトル［＃大見出し終わり］
[chapter:章タイトル]
■挿絵
［＃「キャプション」のキャプション付きの図（ファイル名）入る］
[pixivimage:イラストID]
■リンク
[[jumpuri:タイトル > リンク先URL]]
<a href="URL">タイトル</a>

*/
function AozoraPixiv(str){
//改ページ
var str = str.replace(/［＃改ページ］/mg, "[newpage]");
//ルビ
//青空文庫のルビを漢字《ルビ》から｜漢字《ルビ》に統一
str=AozoraRuby(str);
var str = str.replace(/｜(.+?)《(.+?)》/mg, "[[rb:$1 > $2]]");
//見出し
var str = str.replace(/［＃[大中小]見出し］(.+?)［＃[大中小]見出し終わり］/mg, "[chapter:$1]");
return str;
}
//青空文庫からでんでんコンバーターへの変換
/*
http://conv.denshochan.com/markdown
■改行
改行×２を\n<p><br /></p>\n
改行を\n\n
■見出し
［＃５字下げ］
［＃３字下げ］
［＃[大中小]見出し］
## 見出しレベル2 ##
### 見出しレベル3 ###
#### 見出しレベル4 ####
■改ページ
\n=========\n
■リンク
[こちら](http://example.com/)
■テキストの強調もしくは傍点
*太字*
**斜体**
［＃ここから太字］［＃ここで太字終わり］
［＃ここから斜体］［＃ここで斜体終わり］
■傍点
http://blog.livedoor.jp/denden_proj/archives/48200785.html
より縦書きの場合、*傍点*になる。
■ルビ
{漢字|ルビ}
｜漢字《ルビ》　縦線がないルビをどうするか後で考える
■縦中横
^数字^
数字［＃「数字」は縦中横］
■挿絵
![代替テキスト](img.jpg)
［＃代替テキストの図（img.jpg、横320×縦322）入る］
［＃「代替テキスト」のキャプション付きの図（img.jpg、横564×縦424）入る］
［＃「代替テキスト」のキャプション付きの図（img.jpg）入る］
*/
function AozoraDenden(str){
//改行
var str = str.replace(/\n\n/mg, "\n<p><br /></p>\n");
var str = str.replace(/\n/mg, "\n\n");
var str = str.replace(/\n\n<p><br \/><\/p>\n\n/mg, "\n<p><br /></p>\n");
//見出し
var str = str.replace(/［＃５字下げ］［＃大見出し］(.+?)［＃大見出し終わり］/mg, "## $1 ##");
var str = str.replace(/［＃３字下げ］［＃大見出し］(.+?)［＃大見出し終わり］/mg, "## $1 ##");
var str = str.replace(/［＃５字下げ］［＃中見出し］(.+?)［＃中見出し終わり］/mg, "### $1 ###");
var str = str.replace(/［＃３字下げ］［＃中見出し］(.+?)［＃中見出し終わり］/mg, "### $1 ###");
var str = str.replace(/［＃３字下げ］［＃小見出し］(.+?)［＃小見出し終わり］/mg, "#### $1 ####");
var str = str.replace(/［＃大見出し］(.+?)［＃大見出し終わり］/mg, "## $1 ##");
var str = str.replace(/［＃中見出し］(.+?)［＃中見出し終わり］/mg, "### $1 ###");
var str = str.replace(/［＃小見出し］(.+?)［＃小見出し終わり］/mg, "#### $1 ####");
//字下げを一段階下げた見出しに
var str = str.replace(/^［＃３字下げ］(.+?)$/mg, "##### $1 #####");
var str = str.replace(/^［＃５字下げ］(.+?)$/mg, "##### $1 #####");
//改ページ
var str = str.replace(/［＃改ページ］/mg, "\n=========\n");
//リンク
//<a href="(url)">こちら</a>
//[こちら](http://example.com/)
var str = str.replace(/<a href=\"(.+?)\">(.+?)<\/a>/mg, "[$2]($1)");
//傍点
//*傍点*
//○○［＃「○○」に傍点］
var str = str.replace(/(.+?)［＃「\1」に丸傍点］/mg, "*$1*");
var str = str.replace(/(.+?)［＃「\1」に傍点］/mg, "*$1*");
//ルビ
//青空文庫のルビを漢字《ルビ》から｜漢字《ルビ》に統一
str=AozoraRuby(str);
var str = str.replace(/｜(.+?)《(.+?)》/mg, "{$1|$2}");
//縦中横
var str = str.replace(/(.+?)［＃「\1」は縦中横］/mg, "^$1^");

//挿絵
var str = str.replace(/［＃(.+?)（(.+?)、横\d{3,5}×縦\d{3,5}）入る］/mg, "![$1]($2)");
var str = str.replace(/［＃「(.+?)」のキャプション付きの図（(.+?)）入る］/mg, "![$1]($2)");
var str = str.replace(/［＃(.+?)（(.+?)）入る］/mg, "![$1]($2)");
return str;
}

//// 青空文庫形式からBCCKSに変換
function AozoraBccks(str){
//見出し
str = str.replace(/［＃大見出し］(.+?)［＃大見出し終わり］/mg, "# $1");
str = str.replace(/［＃中見出し］(.+?)［＃中見出し終わり］/mg, "## $1");
str = str.replace(/［＃中見出し］(.+?)［＃中見出し終わり］/mg, "### $1");
//改頁
str = str.replace(/［＃改ページ］/mg, "\n===\n}");
//強調
//縦中横
str = str.replace(/(.+?)［＃「\1」は縦中横］/mg, "[tcy]$1[/tcy]");
//ルビ
str = str.replace(/\{(.+?)\}\((.+?)\)/mg, "｜$1《$2》");
// リンク
return str;
}
//青空文庫のルビを漢字《ルビ》から｜漢字《ルビ》に統一
function AozoraRuby(str){
//カタカナにひらがなでふりがな
str = str.replace(/([ァ-ヺー]+?)《([ぁ-ゖ]+?)》/mg, "｜$1《$2》");
//2重｜の取り消し
str = str.replace(/｜｜(.+?)《(.+?)》/mg, "｜$1《$2》");
//ひらがなにカタカナでふりがな
str = str.replace(/([ぁ-ゖ]+?)《([ァ-ヺー]+?)》/mg, "｜$1《$2》");
//2重｜の取り消し
str = str.replace(/｜｜(.+?)《(.+?)》/mg, "｜$1《$2》");

//漢字にひらがなでふりがな
str = str.replace(/([\u3400-\u4DBF\u4E00-\u9FFF\uD840-\uD87F\uDC00-\uDFFF\uF900-\uFAFF]+?)《([ぁ-ゖ]+?)》/mg, "｜$1《$2》");
//2重｜の取り消し
str = str.replace(/｜｜(.+?)《(.+?)》/mg, "｜$1《$2》");

//漢字にカタカナでふりがな
str = str.replace(/([\u3400-\u4DBF\u4E00-\u9FFF\uD840-\uD87F\uDC00-\uDFFF\uF900-\uFAFF]+?)《([ァ-ヺー]+?)》/mg, "｜$1《$2》");
//アルファベットにひらがなでふりがな
str = str.replace(/([A-Za-z]+?)《([ぁ-ゖ]+?)》/mgi, "｜$1《$2》");
//アルファベットにカタカナでふりがな
str = str.replace(/([A-Za-z]+?)《([ァ-ヺー]+?)》/mgi, "｜$1《$2》");
//2重｜の取り消し
str = str.replace(/｜｜(.+?)《(.+?)》/mg, "｜$1《$2》");
console.log("青空文庫のルビを統一="+str)
return str;
}
