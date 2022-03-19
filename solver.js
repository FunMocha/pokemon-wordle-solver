export function solve() {
    fetch("pokemon_names.json")
        .then(response =>
            response.json())
        .then(json => {
            var listOf5 =
                Object.keys(json)
                    .map(key => json[key])
                    .flat()
                    .filter(name => name.length === 5)

            const resultList = [
                ["アリアドス", [0, 0, 0, 0, 0]],
                ["グラードン", [0, 0, 0, 0, 0]],
                ["ポッタイシ", [0, 0, 0, 0, 0]],
                ["ヤルキモノ", [0, 0, 1, 0, 1]],
            ]
            resultList.forEach(result => {
                listOf5 = filterByResult(listOf5, result[0], result[1])
                console.log(listOf5)
            })
        });
}

function filterByResult(ls, inputName, resultColors) {
    const regexList = resultColors.map((colorId, idx) => {

        if (0 <= inputName.slice(0, idx).search(`${inputName[idx]}`)) {
            // 現在のidxより前に同じ文字が処理されている場合
            // TODO ロジックが雑過ぎぎるので直す。特にcolorId===1。
            return colorId === 0 ? `^.{${idx}}[^${inputName[idx]}].*$` : /// 含まない文字
                colorId === 1 ? `(${inputName[idx]}.*){2,}` : // 含むが位置が異なる文字 
                    `^.{${idx}}${inputName[idx]}.*$` /// 位置も合致している文字
        }
        // if (0 <= inputName.slice(idx + 1,).search(`${inputName[idx]}`)) {
        //     // 現在のidxより後に同じ文字が存在する場合
        // }

        return colorId === 0 ? `^(?!.*${inputName[idx]}).*$` : /// 含まない文字
            colorId === 1 ? `^.*${inputName[idx]}.*$` : // 含むが位置が異なる文字
                `^.{${idx}}${inputName[idx]}.*$` /// 位置も合致している文字
    }
    );
    regexList.forEach(regex =>
        ls = ls.filter(name => name.match(regex))
    )
    return ls
}