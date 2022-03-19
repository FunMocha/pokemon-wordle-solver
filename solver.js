var listOf5 = []

fetch("pokemon_names.json")
    .then(response =>
        response.json())
    .then(json => {
        listOf5 =
            Object.keys(json)
                .map(key => json[key])
                .flat()
                .filter(name => name.length === 5)
    });

function solve() {

    var resultPairList = []
    Array.from(document.getElementsByClassName("name-box")).map((elem, idx) => {

        if (idx % 5 === 0) {
            resultPairList.push(["", []])
        }

        const color = elem.style.backgroundColor;
        const colorId = color === grey ? 0 : color === "rgb(181, 159, 59)" ? 1 : 2
        resultPairList[Math.floor(idx / 5)][0] += elem.textContent
        resultPairList[Math.floor(idx / 5)][1].push(colorId)

    })

    tmpListOf5 = listOf5
    const regex = "^" + resultPairList.map(result => createRegex(result[0], result[1])).flat().join("") + ".*$"

    document.getElementById("result").innerHTML = ""
    tmpListOf5 = tmpListOf5.filter(name => name.match(regex)).forEach(pokemon => {
        document.getElementById("result").innerHTML += `<li>${pokemon}</li>`
    })

}

function createRegex(inputName, resultColors) {

    var duplicateDict = {}
    var regexList = resultColors.map((colorId, idx) => {

        if (0 <= inputName.slice(idx + 1,).search(`${inputName[idx]}`)) {
            // 現在のidxより後に同じ文字が存在する場合
            if (duplicateDict[inputName[idx]]) {
                duplicateDict[inputName[idx]].push([idx, colorId])
            }
            else {
                duplicateDict[inputName[idx]] = [[idx, colorId]]
            }

            return colorId === 0 ? `` : // 含まない文字 別で処理する
                colorId === 1 ? `(?=.*${inputName[idx]})(?!.{${idx}}${inputName[idx]})` : // 含むが位置が異なる文字 
                    `(?=.{${idx}}${inputName[idx]}.{${inputName.length - idx - 1}})` // 位置も合致している文字

        }
        else if (0 <= inputName.slice(0, idx).search(`${inputName[idx]}`)) {
            // 同じ文字を複数含んでおり、そのうちの最後の文字に対する処理
            duplicateDict[inputName[idx]].push([idx, colorId])

        }

        return colorId === 0 ? `(?!.*${inputName[idx]})` : // 含まない文字
            colorId === 1 ? `(?=.*${inputName[idx]})(?!.{${idx}}${inputName[idx]})` : // 含むが位置が異なる文字
                `(?=.{${idx}}${inputName[idx]}.{${inputName.length - idx - 1}})` // 位置も合致している文字
    }
    );

    Object.keys(duplicateDict)
        .forEach(key => {
            const pairList = duplicateDict[key];
            const numOfNotGray = pairList.filter(pair => pair[1] != 0).length;
            if (numOfNotGray.length === 0) {
                // 全てグレー
                regexList.push(`(?!.*${key})`) // keyの文字は含まれない
            }
            else {
                // グレー以外を含む
                pairList.filter(pair => pair[1] == 0)
                    .forEach(pair =>
                        regexList.push(`(?!.{${pair[0]}}${key}.{${5 - pair[0] - 1}})`) // keyの文字は含まれない
                    )

                if (2 <= numOfNotGray) {
                    regexList.push(`(?=(.*${key}.*){${numOfNotGray},})`);
                }
            }

        }
        )
    return regexList.flat()
}