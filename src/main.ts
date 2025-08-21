// テンプレート
// akashic init -t typescript
// gの定義
// https://akashic-games.github.io/guide/common-pitfalls.html
// npm install -DE @akashic/akashic-engine
// Zipファイル(上書き)
// akashic export zip --output game.zip --nicolive -f
// マルチのテストは
// akashic serve -s nicolive

// ニコニコっぽくコメントが流れるように改造

function main(param: g.GameMainParameterObject): void {
	const scene = new g.Scene({ game: g.game });
	// -------------------------------------------------------------
	// シーン押下時(マルチテスト)
	// -------------------------------------------------------------
	scene.onPointDownCapture.add((ev: g.PointDownEvent) => {
		const rect = new g.FilledRect({
			scene: scene,
			cssColor: "red",
			x: ev.point.x,
			y: ev.point.y,
			width: 50,
			height: 50,
		});
		scene.append(rect);
	});
	// let cntRow = 0;
	// -------------------------------------------------------------
	// コメントの受信を行うためのイベントリスナーを追加
	// -------------------------------------------------------------
	scene.onMessage.add((ev: g.MessageEvent) => {
		if (ev.data && ev.data.type === "namagame:comment") {
			const comments = ev.data.comments;
			for (const c of comments) {
				const label = new g.Label({
					scene: scene,
					text: c.comment.trim(), // コメントの内容
					// c.isAnonymous ? "(匿名)" + c.comment
					// 	: c.userID === undefined ? "(生主)" + c.comment
					// 		: "(" + c.name + ")" + c.comment,
					font: new g.DynamicFont({
						game: g.game,
						fontFamily: "monospace",
						// fontWeight: "bold",
						fontColor: "#ffffff",
						strokeColor: "#000000",
						strokeWidth: 6,
						size: 64
					}),
					x: 1280,
					y: 700 * g.game.random.generate(),
					width: 300,
					height: 20
				});
				label.onUpdate.add(() => {
					// ラベルの位置を更新
					label.x -= 8 * (label.text.length < 4 ? 1 : (label.text.length - 4) / 8 + 1);
					label.modified();
					// 画面外に出たら削除
					if (label.x + label.width < 0) {
						scene.remove(label);
						label.destroy();
					}
				});
				scene.append(label);
			}
			// cntRow += comments.length;
		}
	});
	// -------------------------------------------------------------
	// 読込時処理
	// -------------------------------------------------------------
	scene.onLoad.add(() => {
		new g.FilledRect({
			scene: scene,
			cssColor: "white",
			x: 0,
			y: 0,
			width: g.game.width,
			height: g.game.height,
			parent: scene,
		});
		const label = new g.Label({
			scene: scene,
			text: "マルチゲームのテスト",
			font: new g.DynamicFont({
				game: g.game,
				fontFamily: "sans-serif",
				size: 32
			}),
			x: 10,
			y: 10,
			width: 300,
			height: 50
		});
		scene.append(label);
		// コメントの受信を開始
		console.log("コメントの受信を開始します");
		try {
			g.game.external.namagameComment?.start(undefined, () => {
				return;
			});
		} catch (e) {
			console.error("コメントの受信に失敗しました: ", e);
		}
	});
	g.game.pushScene(scene);
}

export = main;
