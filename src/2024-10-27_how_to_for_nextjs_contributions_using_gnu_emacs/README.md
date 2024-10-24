# GNU Emacs を用いた Next.js コントリビュートの howto

-   Copyright (C) 2024 Taku WATABE
-   See the file [`LICENSE`](/LICENSE) for copying conditions
-   Time-stamp: <2024-10-26T18:16:43+09:00>

## 自己紹介

-   `taku_eof`（たく・いーおーえふ）
    -   Taku WATABE
    -   渡部巧
-   Web フロントエンドエンジニア
-   略歴
    -   2001 年：HTML を触りだす
    -   2006 年：社会人生活を開始
    -   2007 年：某 Web 制作会社へ転職、職業「Web フロントエンドエンジニア」になったのはここから
    -   2018 年：現職へ転職
-   [GNU Emacs](https://www.gnu.org/software/emacs/) 歴
    -   2001 年から
        -   高専学科棟の PC 演習室にあった、どこかからおさがりでもらってきたと思しき PC-98 にインストールされていた Vine Linux の内包する GNU Emacs（バージョン失念）
    -   2008 年ごろから数年、xyzzy に浮気していた
        -   その後 xyzzy が更新されなくなったので、GNU Emacs へ出戻り
    -   現在は仕事とプライベートで GNU Emacs 大活躍
    -   `.emacs.d` は [GitHub で管理](https://github.com/takueof/.emacs.d)

## 今回話す内容

**メインの話題は最後の1つだけ**で、あとはオマケのようなもの……かも？

1. Next.js へコントリビュートするに至ったきっかけ
2. コアコード変更は 2 行、テストのほうが長い
3. わかりにくいテスト実行の howto
4. 実はまだ `canary` ブランチにマージされていない
5. 俺たちのコントリビュートはこれからだ（フラグじゃないよ）！
6. **本題：もともと整っていた GNU Emacs の設定**

## Next.js へコントリビュートするに至ったきっかけ

[App Router](https://nextjs.org/docs/app) ではなく旧式の [**Pages Router**](https://nextjs.org/docs/pages) を使っているプロジェクトで、HTTPS 接続の場合に限り、https://foobar.com// のようにルート相対パスのスラッシュ `//` が 2 つ「以上」の URL かつ、ルートページにアクセスしようとしたときだけ JavaScript エラーが投げられる。

```
TypeError: Failed to construct 'URL': Invalid URL
```

-   手打ちで URL を入力しない限りは、そう出る現象ではない
-   しかしバグとして社内 BTS に起票されている以上、何らかの対処をする必要がある

紆余曲折あって、Next.js 側のバグが原因であるとわかった。

-   とりあえず [`patch-package`](https://github.com/ds300/patch-package) で無理矢理 Next.js 側にパッチをあてることで回避できることを実証
    -   しかし、この方法は**あまりにも強引**
    -   そもそも、超レアケースのアクセスでしか発生しえないバグには**おおげさ**
-   「**だったら Next.js へ直接コントリビュートしよう**」という結論をチームリーダーに提案
    -   OK もらえた

## コアコード変更は2行、テストのほうが長い

該当 PR は [`#70144`](https://github.com/vercel/next.js/pull/70144)。

Next.js コアコードの変更は**たった 2 行**。

```diff
export function asPathToSearchParams(asPath: string): URLSearchParams {
-  return new URL(asPath, 'http://n').searchParams
+  const asPathWithoutLeadingSlashes = asPath.replace(/^\/{2,}/, '/')
+  return new URL(asPathWithoutLeadingSlashes, 'http://n').searchParams
}
```

[テストのほうが長い（新規ファイル6つ）](https://github.com/vercel/next.js/pull/70144/files)。

## わかりにくいテスト実行の howto

Next.js のテストは、[公式ドキュメントに書かれている内容](https://github.com/vercel/next.js/blob/canary/contributing/core/testing.md)が**中途半端であるため非常にわかりにくい**。

まずはビルドする必要がある。

```shell
pnpm build
```

それからテストを実行しなければならない……のだが、前述の公式ドキュメントには「**どのディレクトリで何のコマンドを実行すればよいか**」が**書かれていない**。

ちなみに、めんどくさがって全部のテストを実行しようとすると「完了までひと晩以上かかる」うえに「意味不明な要因で 100% fail する」ので無意味。

```shell
# 無意味なテスト
pnpm test-start test
```

執筆時点で判明しているのは、`test/development`, `test/production`, `test/e2e/app-dir` そして `test/unit` ディレクトリはテストが必要……ということだけだ。

```shell
pnpm test-dev test/development
pnpm test-start test/production
pnpm test-start test/e2e/app-dir
pnpm test-start test/unit
```

逆にいえば、ほかの `test/*` ディレクトリはテストする必要がない……らしい？

疑問符をつけたことからわかるように前述の一覧は**不確定情報**なので、他のディレクトリもテストが必要の可能性はある（**情報求む**）。

## 実はまだ `canary` ブランチにマージされていない

-   ひとつ前のパッチは[既存の挙動を壊してしまう](https://github.com/vercel/next.js/pull/70144#issuecomment-2412178117)と、Next.js メンテナーの [ijjk](https://github.com/ijjk) に指摘された
-   今は前述のパッチに変更し、[問題なくテストが通ることを確認済](https://github.com/vercel/next.js/pull/70144#issuecomment-2418303650)

## 俺たちのコントリビュートはこれからだ（フラグじゃないよ）！

-   緊急度が**低い**パッチなので、あとはメンテナーの方々が手すきのときに見てもらえればよい
-   3〜4 週間たっても返事がない場合は、リマインド予定
-   こういうときだからこそ、急かしても印象が悪くなるだけで何も解決しないので、**おちついてのんびりいこう** 🍵

## 本題：もともと整っていた GNU Emacs の設定

ここからは [`2024-10-24` 時点における `init.el`](https://github.com/takueof/.emacs.d/blob/3f562238f08783a2a26a234086cd725e5d8c60c4/init.el) を見ながら解説する。

-   GNU Emacs `29.1` (Stable)
    -   マイナーバージョンが古いのは [`emacs-mac`](https://github.com/railwaycat/homebrew-emacsmacport) の最新がここで止まっているから
    -   それ以上の深い意味はない
-   パッケージ管理は [`leaf`](https://github.com/conao3/leaf.el)
    -   Thanks: [conao3](https://github.com/conao3) ☺️
-   基本 `js-mode` と `js-jsx-mode` で作業
    -   [Tree-Sitter](https://github.com/tree-sitter/tree-sitter) を用いる `js-ts-mode` は自環境で**妙に不安定**
    -   しかも**クラッシュすると GNU Emacs ごと巻き込む**
    -   使っていない……というか、**業務利用では使いものにならない**
-   [LSP](https://microsoft.github.io/language-server-protocol/) は [`lsp-mode`](https://github.com/emacs-lsp/lsp-mode) 派
    -   `eglot` はまだ様子見
        -   なぜか「しっくりこない」ので使っていない……というのが理由のひとつ
    -   当然 [`ts-ls`](https://emacs-lsp.github.io/lsp-mode/page/lsp-typescript/) をインストール済
    -   [`lsp-ui`](https://github.com/emacs-lsp/lsp-ui/), [`consult-lsp`](https://github.com/gagbo/consult-lsp) 利用
-   [Node.js](https://nodejs.org/) 環境
    -   自身が [`nvm`](https://github.com/nvm-sh/nvm) ユーザーのため [`nvm`](https://github.com/rejeep/nvm.el) パッケージで管理

## End of File

Happy Hacking!
