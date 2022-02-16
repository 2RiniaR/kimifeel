# kimifeel

他の人に自分のプロフィールを書いてもらえるサービス。

## ガイド
[こちら](https://kimifile.notion.site/473ae50d379048a39fe76437bf1c4b1c) を参照してください。


## ディレクトリ構成

```text
server/  # サーバーアプリケーション
├ prisma/   # prismaのmigrationファイル類
└ src/  # ソースコード
  │ 
  ├ app/  # メインとなるアプリケーション部分
  │ ├ controllers  # modelsを使用して、endpointsを実装する
  │ ├ endpoints  # 外部から使用する際のインタフェース
  │ └ models  # アプリケーションモデル
  │ 
  ├ auth/  # 認証用アプリケーション部分
  │ ├ controllers  # modelsを使用して、endpointsを実装する
  │ ├ endpoints  # 外部から使用する際のインタフェース
  │ └ models  # アプリケーションモデル
  │ 
  ├ command-parser/  # コマンドパーサ
  │ 
  ├ data-store/  # データアクセスの実装
  │ 
  ├ discord/  # discord周りの実装
  │ ├ actions  # appやauthのendpointsにアクセスし、アクションを行う
  │ ├ adapters  # discord.jsに依存する実装
  │ ├ communicators  # 各アクション時の対話の実装
  │ ├ routers  # アクションを実行するトリガーの定義
  │ ├ structures  # discordモジュール全体で使用するモデル
  │ └ views  # 各アクション時の返信メッセージの実装
  │ 
  └ helpers/

setup/  # discordへのコマンド設定用アプリケーション
└ src/  # ソースコード
  └ commands/  # 各コマンドの定義
```
