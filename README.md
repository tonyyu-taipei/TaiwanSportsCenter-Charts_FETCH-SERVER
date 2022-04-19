# 健身房圖表查詢系統（資料抓取後端）

[系統網址](https://tonyyu.taipei/gym-stats)
[Changelog、Known Bugs、計畫新功能與資料來源](https://hackmd.io/@x9VPntxwQemm0h5ceTvAJw/rJrxViL0F)

網站架構含此[客戶端](https://github.com/tonyyu-taipei/TaiwanSportsCenter-Charts_CLIENT)、[Sails.js後端](https://github.com/tonyyu-taipei/TaiwanSportsCenter-Charts_SAILS-SERVER)與資料庫抓取程式（此Repo）（共三個程式）
資料庫使用MongoDB

## 用處
將各健身房人流抓進資料庫

## 環境設置

請在專案檔根目錄新增.env檔，並在裡面輸入：
```
MONGODB=你的MongoDB連結
AGGtoken=你的阿基里斯Gym帳戶的Token
```


## Project setup
```
npm i
```

### 開啟伺服器
```
node index.js
```

#### 請使用任一排程應用程式，來在您所想要的時間抓取運動中心人流資料。

## 想新增更多運動中心或私人健身房資訊？

歡迎fork專案，並PR
