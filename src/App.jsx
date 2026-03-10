import { useState, useRef } from "react";

const C = {
  red:"#C8102E",redDark:"#9B0B22",redLight:"#F5E6E9",
  black:"#1A1A1A",darkGray:"#2D2D2D",midGray:"#666666",
  lightGray:"#F4F4F4",border:"#E0E0E0",white:"#FFFFFF",
  greenBg:"#E8F5E9",greenText:"#2E7D32",
  blueBg:"#E3F0FF",blueText:"#1A4F99",
  orangeBg:"#FFF3E0",orangeText:"#E65100",
};

// ─── 問題データ（keywords: 採点用キーワードリスト）────────────────────────────
const ALL_Q = {
  beginner: [
    { q:"荷台が箱型で密閉されており雨でも荷物が濡れないトラックを何と呼ぶ？",key:"バン（箱車）",hint:"密閉された箱のような荷台",keywords:[["バン","箱車","ドライバン"]] },
    { q:"両サイドの荷台が羽のように開き、フォークで左右から積み降ろしできるトラックは？",key:"ウイング車（アルミウイング）",hint:"翼のように開く",keywords:[["ウイング","ウィング","アルミウイング"]] },
    { q:"冷凍食品を運ぶ専用トラックを何と呼ぶ？",key:"冷凍車（冷凍冷蔵車）",hint:"温度を下げる機能がある",keywords:[["冷凍車","冷蔵車","冷凍冷蔵"]] },
    { q:"屋根のないフラットな荷台で鉄骨や建材を運ぶトラックは？",key:"平ボディ（平車）",hint:"フラットな荷台",keywords:[["平ボディ","平車","ひらぼでぃ","フラット"]] },
    { q:"国内で最もよく使われているパレットのサイズは？",key:"1100×1100mm（JIS規格）",hint:"正方形に近いサイズ",keywords:[["1100","JIS","ジス"]] },
    { q:"「2024年問題」でドライバーの残業時間は年間何時間までに制限された？",key:"年960時間",hint:"月80時間×12か月のイメージ",keywords:[["960"]] },
    { q:"複数の会社の荷物を1台のトラックに一緒に積んで運ぶ方法は？",key:"混載（路線便）",hint:"シェアして輸送する",keywords:[["混載","路線便","混積"]] },
    { q:"1社の荷物だけをトラック1台に積んで運ぶ方法は？",key:"チャーター便（貸切便）",hint:"専用で借り切る",keywords:[["チャーター","貸切","かしきり"]] },
    { q:"港のコンテナを工場・倉庫まで運ぶトラック輸送を何という？",key:"ドレージ",hint:"海上コンテナのトラック輸送",keywords:[["ドレージ"]] },
    { q:"コンテナから荷物を取り出す作業を何という？",key:"デバンニング",hint:"詰める作業の逆",keywords:[["デバンニング","デバン"]] },
    { q:"コンテナに荷物を詰め込む作業を何という？",key:"バンニング",hint:"取り出す作業の逆",keywords:[["バンニング","バン詰め","バン積"]] },
    { q:"20ftコンテナに積める最大積載重量はおよそ何t？",key:"約22t",hint:"総重量24tからコンテナ自重を引く",keywords:[["22","にじゅうに"]] },
    { q:"フォークなしでも荷物を地上に降ろせる、荷台に付いた昇降装置は？",key:"パワーゲート（テールゲートリフター）",hint:"荷台が昇降する",keywords:[["パワーゲート","テールゲート","ゲート車"]] },
    { q:"荷物をまとめて乗せる木製や樹脂製の台を何という？",key:"パレット",hint:"フォークで差し込んで持ち上げる台",keywords:[["パレット"]] },
    { q:"トラックが荷物を積む・降ろす順番待ちをしている時間を何という？",key:"荷待ち時間",hint:"作業前に待っている時間",keywords:[["荷待ち","にまち","荷待時間"]] },
    { q:"灯油やガソリンは危険物の何類に分類される？",key:"第4類（引火性液体）",hint:"最も流通量の多い類",keywords:[["4類","第4","よんるい","引火"]] },
    { q:"倉庫内でパレットを棚に保管する設備を何という？",key:"パレットラック（ラック）",hint:"棚状の保管設備",keywords:[["ラック","rack","棚"]] },
    { q:"トラック輸送を鉄道や船に切り替えることを何という？",key:"モーダルシフト",hint:"輸送手段を変える",keywords:[["モーダルシフト","モーダル","modal"]] },
    { q:"-18℃以下で食品を保管する倉庫を何という？",key:"冷凍倉庫",hint:"冷凍食品専用の倉庫",keywords:[["冷凍倉庫","れいとうそうこ"]] },
    { q:"注文に応じて倉庫の棚から商品を1個ずつ取り出す作業は？",key:"ピッキング",hint:"注文に応じて選び出す",keywords:[["ピッキング","picking"]] },
    { q:"複数の荷主が配送車両を共有して一緒に運ぶ仕組みは？",key:"共同配送",hint:"コストを分け合う輸送",keywords:[["共同配送","きょうどうはいそう","共同輸送"]] },
    { q:"在庫の数を数えて帳簿と合っているか確認する作業を何という？",key:"棚卸し",hint:"在庫確認の定期作業",keywords:[["棚卸","たなおろし","棚卸し"]] },
    { q:"荷物の積み込み・取り出し作業の総称を何という？",key:"荷役（にやく）",hint:"荷物を扱う作業全般",keywords:[["荷役","にやく","荷捌き"]] },
    { q:"1台のトラックが複数の工場や倉庫を巡回して集荷する方式は？",key:"ミルクラン",hint:"牛乳配達のような動き",keywords:[["ミルクラン","milkrun","巡回集荷","巡回"]] },
    { q:"倉庫管理システムの略称は？",key:"WMS（Warehouse Management System）",hint:"Wから始まる3文字の略語",keywords:[["WMS","wms","ダブリューエムエス"]] },
  ],
  intermediate: [
    { q:"積載率が低い状態が続くと輸送コストにどんな影響が出るか？",key:"1個あたりの輸送単価が上昇する。固定費は同じでも積載量が少ないと割高になる",hint:"固定費の考え方を使う",
      keywords:[["単価","割高","コスト","費用"],["固定費","同じ","変わらない"],["積載","少ない","低い"]] },
    { q:"手積み・手降ろしがコストを押し上げる主な理由を2つ挙げよ",key:"①作業時間が長くなりドライバーの拘束時間が増える　②荷役時間の延長が労働規制に抵触しやすい",hint:"時間コストと法規制の両面",
      keywords:[["時間","拘束","長くなる"],["規制","960","労働","法"]] },
    { q:"500km以上の輸送でモーダルシフトが有利になるのはなぜか？",key:"長距離ほどトラックの燃料費・人件費が増大し鉄道・船舶のコスト優位性が顕在化するから",hint:"距離とコストの関係",
      keywords:[["長距離","距離","遠い"],["燃料","人件費","コスト"],["鉄道","船","有利"]] },
    { q:"混載便が成立するために必要な3つの条件とは？",key:"①方面（行き先）が一致する　②納品時間帯が近い　③荷姿が標準化されている",hint:"マッチングに必要な要素",
      keywords:[["方面","行き先","方向","エリア"],["時間","時間帯","納品"],["荷姿","パレット","標準"]] },
    { q:"共同配送で積載率が上がる仕組みを説明せよ",key:"複数荷主の荷物を同一車両で運ぶことで1社分だけでは埋まらない荷台スペースを埋め合わせる",hint:"1社では足りない空間を補う",
      keywords:[["複数","複数荷主","複数の"],["スペース","空間","荷台","積載"],["埋める","補う","合わせる"]] },
    { q:"デマレージとはどんな費用か？いつ発生するか？",key:"輸入コンテナのフリータイムを超過した場合に発生するコンテナ延滞料金",hint:"フリータイムとの関係",
      keywords:[["フリータイム","無料","期間"],["超過","過ぎ","オーバー"],["延滞","料金","費用"]] },
    { q:"樹脂パレットが食品・医薬品物流で好まれる理由は？",key:"腐食・害虫リスクがなく衛生的。軽量で耐久性も高くGMP・HACCP等の衛生基準を満たしやすい",hint:"木製パレットとの比較",
      keywords:[["衛生","清潔","害虫","腐食"],["軽量","軽い"],["耐久","丈夫","強い"]] },
    { q:"冷凍車が待機中もエンジンを稼働させる理由は？",key:"冷凍機の電源確保のため。停止すると庫内温度が上昇し温度逸脱・品質劣化が起きる",hint:"冷凍機の電源はどこから？",
      keywords:[["電源","電気","エンジン"],["温度","上昇","上がる"],["劣化","品質","逸脱"]] },
    { q:"危険物第4類の「指定数量」とは何か？なぜ重要か？",key:"消防法で定めた危険物の基準量。この数量以上の保管・輸送は特別な許可・届出・専門資格が必要になる",hint:"法規制の基準点",
      keywords:[["消防法","基準","法"],["許可","届出","資格"],["以上","超える","超過"]] },
    { q:"「先入先出し（FIFO）」が食品物流で不可欠な理由は？",key:"賞味期限の古いものを先に出荷しないと期限切れ商品が残り廃棄ロスや食品事故につながる",hint:"賞味期限管理との関係",
      keywords:[["賞味期限","期限","消費期限"],["古い","先","FIFO","ふぃふぉ"],["廃棄","ロス","事故","残る"]] },
    { q:"「帰り便」を活用すると運賃が安くなる理由は？",key:"配送後の空車回送を防ぐため運送会社が帰り荷を割安で引き受けることが多い",hint:"空車コストの観点",
      keywords:[["空車","空回送","空き"],["割安","安く","安い","低い"],["回送","戻る","帰り"]] },
    { q:"ミルクランとはどんな集荷方式か？その効果は？",key:"1台のトラックが複数の工場・拠点を巡回して集荷する方式。便数・車両台数を減らしコストを削減できる",hint:"牛乳配達のような動き方",
      keywords:[["巡回","複数","回る"],["集荷","まとめる"],["削減","減らす","コスト"]] },
    { q:"保税倉庫とはどんな倉庫か？利用メリットは？",key:"輸入貨物を関税未払いのまま保管できる倉庫。再輸出の場合は関税が免除される",hint:"関税と保管の関係",
      keywords:[["関税","かんぜい"],["未払い","払わず","免除"],["輸入","保管","保税"]] },
    { q:"「物流コスト比率」が高い場合、まず何を疑うべきか？",key:"積載率の低下・手作業比率の高さ・配送頻度と物量のミスマッチなど非効率な運用構造",hint:"非効率が発生しやすいポイント",
      keywords:[["積載率","積載","積載量"],["非効率","無駄","ミスマッチ"],["手作業","手積み","人手"]] },
    { q:"フリーロケーション管理と固定ロケーション管理の違いは？",key:"固定は商品ごとに置き場所を固定。フリーは空きスペースに自由配置しWMSで管理。保管効率はフリーが高い",hint:"保管効率の観点",
      keywords:[["固定","決まった","定位置"],["フリー","自由","空き"],["WMS","効率","管理"]] },
    { q:"危険物を異なる類同士で混載してはいけない理由は？",key:"類ごとに性質が異なり混合することで発火・爆発・有毒ガス発生などの危険な化学反応が起きるリスクがある",hint:"化学的な反応リスク",
      keywords:[["化学反応","反応"],["発火","爆発","危険"],["混合","混ざる","接触"]] },
    { q:"「クロスドッキング」が倉庫コストを下げる仕組みを説明せよ",key:"入荷した商品を保管せずそのまま仕分け・積み替えて出荷するため保管スペースや在庫金利がほぼゼロになる",hint:"保管をしないことがポイント",
      keywords:[["保管しない","保管せず","在庫なし"],["仕分け","積み替え"],["スペース","金利","コスト","削減"]] },
    { q:"LCL貨物とFCL貨物でコスト構造はどう違うか？",key:"LCLはCFSで他社と合積みするため仕分けコストが加算される。FCLはコンテナ単価は高いが大量輸送時に割安",hint:"物量で逆転する",
      keywords:[["LCL","lcl","混載"],["FCL","fcl","貸切","コンテナ"],["大量","物量","割安","有利"]] },
    { q:"ユニック（車載クレーン）が平ボディに搭載される理由は？",key:"クレーンや荷役設備のない現場でもトラック単体で荷物の吊り上げ荷役ができるから",hint:"荷役設備のない現場",
      keywords:[["クレーン","吊り上げ","吊る"],["設備がない","設備なし","現場"],["トラック単体","単体"]] },
    { q:"WMSが「在庫精度99%以上」を維持するためにどんな機能が重要か？",key:"入出庫時の検品、ロケーション管理、循環棚卸による差異検知と訂正機能",hint:"差異が発生する場面を考える",
      keywords:[["検品","確認","チェック"],["ロケーション","場所","管理"],["棚卸","差異","訂正"]] },
  ],
  advanced: [
    { q:"荷待ち90分が発生した場合、10t車1台あたりの実質コスト増加をどう説明できるか？",key:"ドライバーの拘束時間が1.5時間延び1日の運行可能距離・件数が減少。2024年問題の960時間上限にも接近し長期的に稼働率と人件費効率を悪化させる",hint:"時間コストと年間上限規制の両面",
      keywords:[["拘束時間","拘束","時間"],["960","上限","規制","2024"],["稼働率","効率","件数","距離"]] },
    { q:"積載率65%が慢性化している。大規模投資なしで改善できる施策を2つ挙げ理由を述べよ",key:"①パレット化・ユニットロード化（荷姿規格化で空間充填率向上）　②共同配送の検討（複数荷主で積み合わせ充填率向上）",hint:"まずできることから考える",
      keywords:[["パレット","ユニットロード","標準化","規格化"],["共同配送","混載","合積み"],["充填","積載率","向上","改善"]] },
    { q:"500km輸送を鉄道コンテナに切り替えるか判断する際、確認すべき3つの条件とは？",key:"①配送頻度とロットが定期・大量か　②ラストマイルを含めたトータルコストが有利か　③リードタイムが1〜2日長くなっても許容できるか",hint:"コスト・物量・リードタイムの3軸",
      keywords:[["頻度","ロット","定期","物量"],["ラストマイル","トータルコスト","コスト","全体"],["リードタイム","日数","時間","許容"]] },
    { q:"灯油2,000L（非水溶性）を1台で輸送する場合、消防法上どんな対応が必要か？",key:"第2石油類（非水溶性）の指定数量は1,000L。2倍のため危険物取扱者の乗車・移動タンク貯蔵所許可・危険マーク掲示・消火器搭載が必要",hint:"指定数量と比較して何倍かを考える",
      keywords:[["指定数量","1000","1,000"],["危険物取扱者","資格","乗車"],["許可","消火器","マーク"]] },
    { q:"倉庫の保管効率が95%を超えると何が問題になるか？最適値はいくつか？",key:"荷物の入れ替えスペースがなくなり入出庫効率が低下。適正は85%前後でバッファが必要",hint:"100%が最良でない理由を考える",
      keywords:[["スペース","場所","余裕","バッファ"],["効率","低下","悪化","困難"],["85","はちじゅうご","適正","最適"]] },
    { q:"食品業界の「1/3ルール」とは何か？物流にどう影響するか？",key:"賞味期限の残り1/3を超えた商品は小売が受け付けない商慣習。FIFO厳守・高頻度配送が必要になる",hint:"賞味期限の消費ルールから逆算する",
      keywords:[["賞味期限","1/3","三分の一"],["小売","スーパー","受け付けない","返品"],["FIFO","先入先出","高頻度","配送"]] },
    { q:"スタッカークレーン式自動倉庫の導入が適切なケースと不適切なケースを各1つ述べよ",key:"適切：高回転・高頻度の品目を大量保管し省人化したい場合。不適切：SKU数が多く入出庫パターンが不規則・季節変動が大きい場合",hint:"設備の柔軟性の限界を考える",
      keywords:[["高回転","高頻度","大量"],["省人","自動","効率"],["不規則","変動","SKU","季節","不向き"]] },
    { q:"「誤出荷率0.1%以下」の目標達成に最低限必要な仕組みを3つ挙げよ",key:"①出荷時の二重検品（ダブルチェック）　②バーコード/RFID照合による自動確認　③WMSによる出庫指示の一元化",hint:"ヒューマンエラーを防ぐ仕組み",
      keywords:[["二重","ダブルチェック","検品"],["バーコード","RFID","スキャン","照合"],["WMS","システム","一元化","管理"]] },
    { q:"新規エリアへの配送展開で運送会社が見つからない場合、真っ先に確認すべきことは？",key:"①採算が取れない遠隔地・小ロットかどうか　②荷役条件（手降ろし・荷待ち長）が敬遠されていないか　③帰り便が組めない片道輸送になっていないか",hint:"相手が断る理由を相手目線で考える",
      keywords:[["採算","小ロット","遠隔"],["荷役","手降ろし","荷待ち","条件"],["帰り便","片道","空車"]] },
    { q:"倉庫診断で「ピッキング生産性が低い」と判明した。動線以外で改善できる施策を2つ挙げよ",key:"①ABC分析でAランク品を優良ロケーションに集約する　②GTP方式の導入で人が棚まで移動する時間をゼロにする",hint:"人が歩く量を減らす方法",
      keywords:[["ABC分析","Aランク","頻度","優良ロケーション"],["GTP","自動","ロボット","棚"],["移動","歩く","時間","ゼロ"]] },
    { q:"共同配送の導入を阻む最大の実務課題と解決策を述べよ",key:"競合荷主間の情報共有への抵抗。第三者物流事業者がプラットフォームを仲介し個別情報を開示せずマッチングする仕組みが有効",hint:"競合他社と協力することの障壁",
      keywords:[["競合","情報","セキュリティ","漏洩","抵抗"],["第三者","仲介","プラットフォーム"],["マッチング","開示せず","非公開"]] },
    { q:"「往復利用」を提案する際、荷主に確認すべき最重要事項は？",key:"帰り便の荷物の有無・物量・荷姿・納品先方向が往路の配送エリアと合致するか。マッチングが成立しなければ効果は得られない",hint:"往路と復路の条件が揃わないと成立しない",
      keywords:[["帰り","復路","戻り"],["方向","エリア","行き先","合致"],["マッチング","成立","荷物の有無"]] },
    { q:"40ftハイキューブコンテナを使う判断基準は？通常の40ftと何が違うか？",key:"天井高が2.9m（通常2.39m）で容積が約76㎥（通常67㎥）。軽量でかさ高い商品を容積基準で満載にしたい場合に有利",hint:"重量制約と容積制約のどちらが先か",
      keywords:[["天井","高さ","2.9","ハイキューブ"],["容積","76","かさ高","嵩高"],["軽量","軽い","重量","容積"]] },
    { q:"GDP（医薬品適正流通基準）への対応で最も難しいオペレーション上の課題は？",key:"輸送中の温度ロガーによる連続記録と逸脱時の対応手順（CAPA）の文書化。証跡・トレーサビリティの維持が難しい",hint:"温度管理だけでなく記録も重要",
      keywords:[["温度","ロガー","記録"],["逸脱","CAPA","対応手順"],["トレーサビリティ","証跡","文書"]] },
    { q:"EVトラック導入でCO2削減効果を訴求する際の注意点は？",key:"カーボンオフセット分と実削減量を区別する必要がある。電源構成の再エネ比率によってLCA排出量が変わるため数値の根拠が重要",hint:"見かけの削減と実質の削減を区別する",
      keywords:[["オフセット","実削減","区別"],["電源","再エネ","再生可能"],["LCA","排出量","根拠","数値"]] },
  ],
};

// ─── キーワード採点エンジン ────────────────────────────────────────────────────
function scoreAnswer(userAnswer, question) {
  const ua = userAnswer.toLowerCase();
  const kws = question.keywords;

  if (!kws || kws.length === 0) {
    // フォールバック：key文字列から自動抽出
    const keyWords = question.key.split(/[・、。,\s　]+/).filter(w => w.length >= 2);
    const hit = keyWords.filter(w => ua.includes(w.toLowerCase())).length;
    const ratio = hit / Math.max(keyWords.length, 1);
    return ratio >= 0.7 ? 4 : ratio >= 0.4 ? 3 : ratio >= 0.15 ? 2 : 1;
  }

  // 各キーワードグループのうち、いくつヒットするか
  const totalGroups = kws.length;
  const hitGroups = kws.filter(group => group.some(w => ua.includes(w.toLowerCase()))).length;
  const ratio = hitGroups / totalGroups;

  if (ratio >= 1.0)   return 4;
  if (ratio >= 0.67)  return 3;
  if (ratio >= 0.33)  return 2;
  return 1;
}

function buildFeedback(score, userAnswer, question) {
  const ua = userAnswer.toLowerCase();
  const kws = question.keywords || [];
  const missedGroups = kws.filter(group => !group.some(w => ua.includes(w.toLowerCase())));

  const feedbacks = {
    4: "完璧な解答です！重要なポイントをすべて押さえています。",
    3: "概ね正解です。あと一歩で完璧です。",
    2: "部分的に合っています。重要なキーワードが不足しています。",
    1: "核心部分が不足しています。模範解答を確認して復習しましょう。",
  };

  const missing = missedGroups.length > 0
    ? `「${missedGroups[0][0]}」などのポイントを追加しましょう`
    : "";

  return { feedback: feedbacks[score], missing_point: missing };
}

// ─── UTILITY ─────────────────────────────────────────────────────────────────
const LEVEL_META = {
  beginner:     { label:"初級", icon:"🟢", color:C.greenText,  bg:C.greenBg,  border:"#A5D6A7", desc:"用語・基本知識" },
  intermediate: { label:"中級", icon:"🟡", color:C.orangeText, bg:C.orangeBg, border:"#FFCC80", desc:"仕組みと理由の理解" },
  advanced:     { label:"上級", icon:"🔴", color:C.redDark,    bg:C.redLight, border:"#EF9A9A", desc:"判断力・実務思考" },
};
const SCORE_META = {
  4:{ label:"完璧",    icon:"🏆", color:C.greenText,  bg:C.greenBg  },
  3:{ label:"良好",    icon:"✅", color:C.blueText,   bg:C.blueBg   },
  2:{ label:"一部正解",icon:"🔶", color:C.orangeText, bg:C.orangeBg },
  1:{ label:"理解不足",icon:"❌", color:C.red,         bg:C.redLight },
};

function shuffle(arr){ const a=[...arr]; for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]];} return a; }

function pickQuestions(count, levels){
  const perLevel = Math.ceil(count / levels.length);
  const pool = levels.flatMap(lv => shuffle(ALL_Q[lv]).slice(0, perLevel).map(q => ({...q, level:lv})));
  return shuffle(pool).slice(0, count);
}

function getRating(pct){
  if(pct>=90)return{label:"物流設計者レベル",icon:"🏆",desc:"制約・コスト・代替案を統合して最適解を導ける人材です"};
  if(pct>=75)return{label:"実務中堅レベル",  icon:"⭐",desc:"改善課題を自ら発見し提案の筋道を立てられるレベルです"};
  if(pct>=55)return{label:"基礎実務レベル",  icon:"📦",desc:"現場の流れとコスト感覚を持ち始めているレベルです"};
  return           {label:"入門レベル",       icon:"📚",desc:"基礎用語の学習からスタートしましょう"};
}

function Logo({size=24,light=false}){
  return(
    <span style={{fontFamily:"'Arial Black','Arial Bold',Arial,sans-serif",fontWeight:900,fontSize:size,letterSpacing:"-0.5px",color:light?C.white:C.black,textTransform:"uppercase",lineHeight:1}}>
      MIKOMI <span style={{color:C.red}}>LOGI</span>
    </span>
  );
}

// ─── MAIN APP ────────────────────────────────────────────────────────────────
export default function App(){
  const[screen,setScreen]=useState("home");
  const[selectedLevels,setSelectedLevels]=useState(["beginner","intermediate","advanced"]);
  const[questionCount,setQuestionCount]=useState(10);
  const[questions,setQuestions]=useState([]);
  const[currentIdx,setCurrentIdx]=useState(0);
  const[answers,setAnswers]=useState([]);
  const[inputVal,setInputVal]=useState("");
  const[isGrading,setIsGrading]=useState(false);
  const[showHint,setShowHint]=useState(false);
  const[results,setResults]=useState([]);
  const textareaRef=useRef(null);

  const toggleLevel=(lv)=>setSelectedLevels(prev=>prev.includes(lv)?prev.length>1?prev.filter(x=>x!==lv):prev:[...prev,lv]);

  const startTest=()=>{
    const qs=pickQuestions(questionCount,selectedLevels);
    setQuestions(qs);setCurrentIdx(0);setAnswers([]);setInputVal("");setShowHint(false);setResults([]);setScreen("test");
  };

  const submitAnswer=()=>{
    if(!inputVal.trim()||isGrading)return;
    setIsGrading(true);
    // キーワード採点（即時・無料）
    const q=questions[currentIdx];
    const score=scoreAnswer(inputVal.trim(),q);
    const{feedback,missing_point}=buildFeedback(score,inputVal.trim(),q);
    const result={score,feedback,missing_point};

    setTimeout(()=>{ // 採点感を出すための短い遅延
      const newAnswer={question:q,userAnswer:inputVal.trim(),result};
      const newAnswers=[...answers,newAnswer];
      setAnswers(newAnswers);setIsGrading(false);
      if(currentIdx+1>=questions.length){setResults(newAnswers);setScreen("result");}
      else{setCurrentIdx(currentIdx+1);setInputVal("");setShowHint(false);}
    },600);
  };

  const totalScore=results.reduce((s,r)=>s+r.result.score,0);
  const maxScore=results.length*4;
  const pct=maxScore>0?Math.round((totalScore/maxScore)*100):0;

  // HOME
  if(screen==="home") return(
    <div style={{minHeight:"100vh",background:C.lightGray,fontFamily:"Arial,'Hiragino Kaku Gothic ProN',sans-serif"}}>
      <div style={{background:C.black,padding:"0 20px"}}>
        <div style={{maxWidth:600,margin:"0 auto",display:"flex",alignItems:"center",justifyContent:"space-between",height:56}}>
          <Logo size={20} light/>
          <span style={{color:"#888",fontSize:12}}>物流理解度診断テスト</span>
        </div>
      </div>
      <div style={{background:`linear-gradient(135deg,${C.black} 0%,#3A0A12 100%)`,padding:"48px 20px 40px",textAlign:"center"}}>
        <div style={{maxWidth:520,margin:"0 auto"}}>
          <div style={{display:"inline-block",background:C.red,color:C.white,fontSize:11,fontWeight:"bold",letterSpacing:2,padding:"4px 14px",borderRadius:2,marginBottom:20}}>
            LOGISTICS COMPETENCY TEST
          </div>
          <div style={{marginBottom:12}}><Logo size={26} light/></div>
          <h1 style={{color:C.white,fontSize:24,fontWeight:"bold",margin:"0 0 12px",lineHeight:1.5}}>物流理解度<br/>診断テスト</h1>
          <p style={{color:"#AAA",fontSize:14,margin:0,lineHeight:1.9}}>キーワード自動採点で即時フィードバック。<br/>完全無料・登録不要で使えます。</p>
        </div>
      </div>
      <div style={{maxWidth:560,margin:"0 auto",padding:"24px 16px 40px"}}>
        <div style={{background:C.white,borderRadius:12,padding:"20px",marginBottom:14,boxShadow:"0 2px 8px rgba(0,0,0,0.08)"}}>
          <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:16}}>
            <div style={{width:4,height:18,background:C.red,borderRadius:2}}/>
            <span style={{fontWeight:"bold",fontSize:15,color:C.black}}>出題レベルを選択</span>
            <span style={{color:C.midGray,fontSize:12,marginLeft:4}}>（複数選択可）</span>
          </div>
          <div style={{display:"flex",flexDirection:"column",gap:10}}>
            {Object.entries(LEVEL_META).map(([lv,meta])=>{
              const active=selectedLevels.includes(lv);
              return(
                <div key={lv} onClick={()=>toggleLevel(lv)} style={{display:"flex",alignItems:"center",gap:14,padding:"14px 16px",borderRadius:10,border:`2px solid ${active?meta.border:C.border}`,background:active?meta.bg:C.white,cursor:"pointer",transition:"all 0.15s"}}>
                  <div style={{width:22,height:22,borderRadius:6,border:`2px solid ${active?meta.color:C.border}`,background:active?meta.color:C.white,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
                    {active&&<span style={{color:C.white,fontSize:14,lineHeight:1}}>✓</span>}
                  </div>
                  <div style={{flex:1}}>
                    <div style={{fontWeight:"bold",fontSize:15,color:active?meta.color:C.midGray}}>{meta.icon} {meta.label}</div>
                    <div style={{fontSize:12,color:C.midGray}}>{meta.desc}</div>
                  </div>
                  <div style={{fontSize:12,color:C.midGray}}>{ALL_Q[lv].length}問</div>
                </div>
              );
            })}
          </div>
          {selectedLevels.length===1&&<p style={{color:C.midGray,fontSize:12,marginTop:10,textAlign:"center"}}>※ 最低1レベルは選択が必要です</p>}
        </div>
        <div style={{background:C.white,borderRadius:12,padding:"20px",marginBottom:18,boxShadow:"0 2px 8px rgba(0,0,0,0.08)"}}>
          <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:16}}>
            <div style={{width:4,height:18,background:C.red,borderRadius:2}}/>
            <span style={{fontWeight:"bold",fontSize:15,color:C.black}}>出題数を選択</span>
          </div>
          <div style={{display:"flex",gap:10}}>
            {[5,10,15,20].map(n=>(
              <button key={n} onClick={()=>setQuestionCount(n)} style={{flex:1,padding:"12px 0",borderRadius:8,border:`2px solid ${questionCount===n?C.red:C.border}`,background:questionCount===n?C.red:C.white,color:questionCount===n?C.white:C.darkGray,fontWeight:"bold",fontSize:16,cursor:"pointer",transition:"all 0.15s"}}>
                {n}問
              </button>
            ))}
          </div>
        </div>
        <button onClick={startTest} style={{width:"100%",padding:"18px",borderRadius:10,border:"none",background:C.red,color:C.white,fontSize:18,fontWeight:"bold",cursor:"pointer",letterSpacing:1,boxShadow:"0 4px 16px rgba(200,16,46,0.35)"}}>
          診断スタート　→
        </button>
        <p style={{color:C.midGray,fontSize:12,textAlign:"center",marginTop:12}}>問題は毎回ランダムに出題されます</p>
      </div>
    </div>
  );

  // TEST
  if(screen==="test"){
    const q=questions[currentIdx];
    const meta=LEVEL_META[q.level];
    const progress=(currentIdx/questions.length)*100;
    return(
      <div style={{minHeight:"100vh",background:C.lightGray,fontFamily:"Arial,'Hiragino Kaku Gothic ProN',sans-serif",paddingBottom:40}}>
        <div style={{background:C.black,padding:"0 16px"}}>
          <div style={{maxWidth:600,margin:"0 auto",display:"flex",alignItems:"center",justifyContent:"space-between",height:52}}>
            <Logo size={17} light/>
            <span style={{color:"#AAA",fontSize:14,fontWeight:"bold"}}>{currentIdx+1} <span style={{color:"#666"}}>/ {questions.length}</span></span>
          </div>
        </div>
        <div style={{height:4,background:"#333"}}>
          <div style={{height:"100%",background:C.red,width:`${progress}%`,transition:"width 0.5s"}}/>
        </div>
        <div style={{maxWidth:600,margin:"0 auto",padding:"20px 16px"}}>
          <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:16}}>
            <span style={{background:meta.color,color:C.white,fontSize:11,fontWeight:"bold",padding:"4px 12px",borderRadius:3,letterSpacing:1}}>{meta.icon} {meta.label}</span>
            <span style={{color:C.midGray,fontSize:13}}>{meta.desc}</span>
          </div>
          <div style={{background:C.white,borderRadius:12,padding:"24px",boxShadow:"0 2px 10px rgba(0,0,0,0.08)",marginBottom:14,borderLeft:`5px solid ${meta.color}`}}>
            <p style={{color:C.black,fontSize:19,fontWeight:"bold",lineHeight:1.7,margin:0}}>{q.q}</p>
          </div>
          {!showHint?(
            <button onClick={()=>setShowHint(true)} style={{background:"transparent",border:`1px dashed ${C.border}`,color:C.midGray,padding:"8px 16px",borderRadius:8,cursor:"pointer",fontSize:13,marginBottom:14}}>💡 ヒントを見る</button>
          ):(
            <div style={{background:"#FFFDE7",border:"1px solid #FDD835",borderRadius:8,padding:"12px 16px",marginBottom:14}}>
              <span style={{color:"#795548",fontSize:14}}>💡 {q.hint}</span>
            </div>
          )}
          <div style={{background:C.white,borderRadius:12,padding:"20px",boxShadow:"0 2px 10px rgba(0,0,0,0.08)"}}>
            <label style={{display:"block",fontWeight:"bold",fontSize:13,color:C.darkGray,marginBottom:10}}>あなたの解答</label>
            <textarea ref={textareaRef} value={inputVal} onChange={e=>setInputVal(e.target.value)} placeholder="解答を入力してください..." disabled={isGrading} rows={4}
              style={{width:"100%",border:`2px solid ${C.border}`,borderRadius:8,padding:"12px",fontSize:15,fontFamily:"inherit",resize:"vertical",outline:"none",boxSizing:"border-box",color:C.black,background:isGrading?C.lightGray:C.white}}
              onFocus={e=>e.target.style.borderColor=C.red} onBlur={e=>e.target.style.borderColor=C.border}
            />
            <button onClick={submitAnswer} disabled={!inputVal.trim()||isGrading} style={{width:"100%",marginTop:12,padding:"14px",borderRadius:8,border:"none",background:!inputVal.trim()||isGrading?"#CCC":C.red,color:C.white,fontSize:16,fontWeight:"bold",cursor:!inputVal.trim()||isGrading?"not-allowed":"pointer",transition:"background 0.2s"}}>
              {isGrading?"⚡ 採点中...":currentIdx+1>=questions.length?"採点して結果を見る ✓":"採点して次の問題へ　→"}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // RESULT
  const rating=getRating(pct);
  const byLevel={beginner:[],intermediate:[],advanced:[]};
  results.forEach(r=>byLevel[r.question.level].push(r));

  return(
    <div style={{minHeight:"100vh",background:C.lightGray,fontFamily:"Arial,'Hiragino Kaku Gothic ProN',sans-serif",paddingBottom:60}}>
      <div style={{background:C.black,padding:"0 16px"}}>
        <div style={{maxWidth:600,margin:"0 auto",display:"flex",alignItems:"center",height:52}}><Logo size={17} light/></div>
      </div>
      <div style={{maxWidth:600,margin:"0 auto",padding:"24px 16px"}}>
        <div style={{background:`linear-gradient(135deg,${C.black},#3A0A12)`,borderRadius:16,padding:"32px 24px",textAlign:"center",marginBottom:20,boxShadow:"0 8px 32px rgba(0,0,0,0.2)"}}>
          <div><Logo size={17} light/></div>
          <div style={{color:"#888",fontSize:13,marginTop:16,marginBottom:8}}>総合スコア</div>
          <div style={{color:C.white,fontSize:72,fontWeight:"bold",lineHeight:1,fontFamily:"'Arial Black',Arial"}}>
            {pct}<span style={{fontSize:28,color:C.red}}>%</span>
          </div>
          <div style={{color:"#777",fontSize:13,marginTop:6}}>{totalScore} / {maxScore} 点</div>
          <div style={{marginTop:20,display:"inline-block",background:C.red,color:C.white,fontWeight:"bold",fontSize:16,padding:"10px 28px",borderRadius:4}}>
            {rating.icon} {rating.label}
          </div>
          <p style={{color:"#999",fontSize:13,marginTop:14,lineHeight:1.7}}>{rating.desc}</p>
        </div>
        <div style={{display:"flex",gap:10,marginBottom:20}}>
          {Object.entries(byLevel).map(([lv,qs])=>{
            if(!qs.length)return null;
            const meta=LEVEL_META[lv];
            const avg=qs.reduce((s,r)=>s+r.result.score,0)/qs.length;
            return(
              <div key={lv} style={{flex:1,background:C.white,borderRadius:10,padding:"14px",textAlign:"center",borderTop:`4px solid ${meta.color}`,boxShadow:"0 2px 6px rgba(0,0,0,0.06)"}}>
                <div style={{fontSize:18}}>{meta.icon}</div>
                <div style={{color:meta.color,fontSize:22,fontWeight:"bold"}}>{Math.round((avg/4)*100)}%</div>
                <div style={{color:C.midGray,fontSize:11}}>{meta.label} {qs.length}問</div>
              </div>
            );
          })}
        </div>
        <h3 style={{color:C.black,fontSize:16,fontWeight:"bold",margin:"0 0 14px"}}>問題ごとの解説</h3>
        {results.map((r,i)=>{
          const meta=LEVEL_META[r.question.level];
          const sm=SCORE_META[r.result.score];
          return(
            <div key={i} style={{background:C.white,borderRadius:12,padding:"18px",marginBottom:12,borderLeft:`4px solid ${meta.color}`,boxShadow:"0 2px 6px rgba(0,0,0,0.06)"}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",gap:12,marginBottom:12}}>
                <div style={{flex:1}}>
                  <div style={{display:"flex",gap:8,alignItems:"center",marginBottom:6}}>
                    <span style={{background:meta.color,color:C.white,fontSize:11,padding:"2px 8px",borderRadius:3,fontWeight:"bold"}}>Q{i+1}</span>
                    <span style={{color:meta.color,fontSize:12,fontWeight:"bold"}}>{meta.label}</span>
                  </div>
                  <p style={{color:C.black,fontWeight:"bold",fontSize:14,margin:0,lineHeight:1.6}}>{r.question.q}</p>
                </div>
                <div style={{background:sm.bg,borderRadius:8,padding:"8px 12px",textAlign:"center",minWidth:60,flexShrink:0}}>
                  <div style={{fontSize:18}}>{sm.icon}</div>
                  <div style={{color:sm.color,fontSize:11,fontWeight:"bold"}}>{sm.label}</div>
                  <div style={{color:sm.color,fontSize:16,fontWeight:"bold"}}>{r.result.score}/4</div>
                </div>
              </div>
              <div style={{background:C.lightGray,borderRadius:6,padding:"10px 12px",marginBottom:8,fontSize:13}}>
                <div style={{color:C.midGray,fontSize:11,marginBottom:3}}>あなたの解答</div>
                <div style={{color:C.black}}>{r.userAnswer}</div>
              </div>
              <div style={{background:C.greenBg,borderRadius:6,padding:"10px 12px",marginBottom:8,fontSize:13}}>
                <div style={{color:C.greenText,fontSize:11,marginBottom:3}}>模範解答のポイント</div>
                <div style={{color:C.black}}>{r.question.key}</div>
              </div>
              <div style={{background:r.result.score>=3?C.blueBg:C.redLight,borderRadius:6,padding:"10px 12px",fontSize:13,color:C.darkGray}}>
                <span style={{fontWeight:"bold"}}>採点結果：</span>{r.result.feedback}
                {r.result.missing_point&&<span style={{color:C.red,marginLeft:8}}>▶ {r.result.missing_point}</span>}
              </div>
            </div>
          );
        })}
        <div style={{display:"flex",gap:12,marginTop:24}}>
          <button onClick={startTest} style={{flex:1,padding:"14px",borderRadius:8,border:"none",background:C.red,color:C.white,fontSize:15,fontWeight:"bold",cursor:"pointer"}}>🔄 もう一度挑戦</button>
          <button onClick={()=>setScreen("home")} style={{padding:"14px 18px",borderRadius:8,border:`2px solid ${C.border}`,background:C.white,color:C.darkGray,fontSize:14,fontWeight:"bold",cursor:"pointer"}}>🏠 TOP</button>
        </div>
        <p style={{textAlign:"center",color:"#CCC",fontSize:11,marginTop:24}}>Powered by MIKOMI LOGI</p>
      </div>
    </div>
  );
}
