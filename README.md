【このアプリについて】
「Multi Translator」は複数の言語に対応した翻訳アプリです。
文章の翻訳だけでなく画像の翻訳や音声を認識した翻訳の機能もあります。
また、お気に入りフレーズの登録機能も備えており、様々なシーンでよく使われるフレーズを登録でき、シンプルな翻訳アプリとしてだけでなく一つの勉強ツールとしてもご利用いただけます。

【認証情報】
メールアドレス: yuu@example.com
パスワード: password

【機能一覧】
・音声、テキストの翻訳:
ネイティブアプリによくあるような音声を入力して指定言語に翻訳できる機能を Web 上で簡単に利用できるようになっています。また、言語を指定しなかった場合、自動で認識して日本語に変換します。これによって相手がどの言語を話す人なのか尋ねる必要がなくなります。

・画像の翻訳
伝えたいテキストが手元にある場合、自動で文字起こしをしてその文章を元画像に重ねる形で画像の翻訳が可能です。これによって、翻訳したい文章を手入力する必要がなくなり、画像に重ねることで直感的に利用できます。

・お気に入りフレーズ登録
よく利用するフレーズをカテゴリごとに登録できます。例えば、「道案内」や「旅行」などのシチュエーションごとに登録しておくことが出来ます。

【このアプリを制作した背景】
私は接客業をしており、海外からの観光客の方の接客を日々行っております。そんな中で自動で相手の言語を認識して翻訳できるアプリがあればスタッフにも、店舗にも貢献できるのではないかと考え、このアプリの制作を開始しました。
また、自分自身英語は話せるものの、英語が話せないお客様への対応が難しいということがありましたので一つの言語だけでなく様々な言語に対応したアプリの必要性を感じました。
このアプリの特徴の一つでもあるお気に入りフレーズ機能に関しては、咄嗟に英語のフレーズが思いつかないシーンが多くあり、気になるフレーズを登録できる機能があれば日頃確認もでき、他スタッフやお客様にもそのフレーズを利用していただけるという部分にメリットを感じ実装いたしました。

【技術選定理由】
・React:
処理の速さやコンポーネント単位での管理など SPA に最適だと考えました。また JavaScript ライブラリの中でも人気の高いライブラリで使われているシーンも多いと考えたのでフロントエンドに採用しました。

・vite:
create-react-app が公式に非推奨となったことや、より高速にビルドやホットリロードが行えるので React のビルドツールには vite を採用しています。

・Node.js:
サーバーサイドには Node.js のフレームワークである Express.js を採用してます。主要な機能を外部 API で実現し、バックエンドでは認証とフレーズの管理のみ行うので軽量な Express.js を採用しています。また、SSR などのフロントエンド技術にも Node.js が利用されるので、取得するメリットも多いと考え Node.js を採用しています。

・MongoDB:
データベースには MongoDB を採用しています。こちらに関しても、データ構造が複雑にあまり複雑にはならないと考え、SQL ではなく JSON 形式で操作が簡略化できると考えました。

・axios:
fetch ではなく axios を選定した理由はエラーハンドリングの容易さと intercepter によるデータの前処理が可能でコードの可読性が向上すると考えたました。

・Google Cloud:
本アプリケーションには翻訳機能や画像認識に Google Cloud を使用しています。翻訳に関する様々な機能が利用でき、またクラウドサービスも提供しているので一元管理でき、容易になると考えました。

・Google Cloud Run:
サーバは GCP の Cloud Run で動作しています。Docker ファイルをそのまま利用できるので Cloud Run を採用しました。

【今後の展望】
今後はテストの実装、CI/CD パイプラインの構築やよく使うフレーズ、言語の機能の追加を予定しています。
