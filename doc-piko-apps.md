# ToDo


## 環境構築

```
npm install --save @angular/material @angular/cdk
npm install --save @angular/animations
npm install --save hammerjs
npm install angularfire2 firebase --save
npm install ngx-pipes --save
npm install ngx-clipboard --save
```


## app

### 日程調整ツール

* 週選択機能
* 範囲選択機能
* Googleカレンダー併記機能
* edit-event.component
  * template修正中
  * 編集反映時に別の場所で編集が登録されていたら確認
* answer-pageは完了


### その他

* data-table のデモページ作成

* 設計
  * MyClassNameOnDatabase というinterfaceを別に作る
      （class定義部分でinitObjのメンバ名を変えたときに
      database上での文字列を変更するのをよく忘れてしまうので）
  * cloud-fire-store.service.ts は firedatabase.ts に
      or databaseを変えても同じように使えるように、apiは firedatabase.ts に吸収させる

* directive使って共用cssを整理
* symbolidは型チェックさせる ( symbol-settings.ts )
* "event", "myEvent" 統一．`event$` と紛らわしいからmyEventにする？
* InputはObservableに統一する？
  * ObservableInputの自前実装を調べる
* edit-eventはただの変数で実装する

* 改修工事中
  * select-dates.component
  * edit-event.component

* 
