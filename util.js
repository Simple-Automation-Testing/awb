const arrayToSubArrays = (arr, formedArr = [], arrLenth = 8) => {
  if(arr.length >= arrLenth) {
    formedArr.push(arr.splice(0, 8))

    return arrayToSubArrays(arr, formedArr, arrLenth)

  } else if(arr.length < arrLenth) {
    formedArr.push(arr.splice(0, arr.length))
  }
  return formedArr
}