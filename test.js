const tanklist1 = [
  "41T-301",
  "41T-302",
  "41T-303",
  "41T-304",
  "41T-305",
  "41T-306",
  "41T-307",
  "41T-308",
  "41T-309",
  "41T-310",
  "41T-311",
  "41T-315",
  "41T-316",
  "41T-317",
]; //213
const tanklist2 = ["35T-2", "35T-4"]; //223
const tanklist3 = [
  "41T-111",
  "41T-112",
  "41T-113",
  "41T-114",
  "41T-115",
  "41T-116",
  "41T-117",
  "41T-118",
  "41T-121",
]; //226
const tanklist4 = [
  "41T-101",
  "41T-102",
  "41T-103",
  "41T-104",
  "41T-105",
  "41T-106",
  "41T-107",
  "41T-108",
  "41T-122",
]; //227
const tanklist5 = ["41T-26"]; //228
const tanklist6 = ["41T-24"]; //229
const tanklist7 = ["41T-109", "41T-110", "41T-119", "41T-120"]; //231
const tanklist8 = [
  "41T-304",
  "41T-305",
  "41T-306",
  "41T-307",
  "41T-308",
  "41T-309",
  "41T-315",
  "41T-316",
]; //234
const tanklist9 = [
  "41T-301",
  "41T-302",
  "41T-303",
  "41T-310",
  "41T-311",
  "41T-312",
  "41T-313",
  "41T-314",
  "41T-317",
]; //235
const all_tank_raw = tanklist1.concat(
  tanklist2,
  tanklist3,
  tanklist4,
  tanklist5,
  tanklist6,
  tanklist7,
  tanklist8,
  tanklist9
);
const all_tank = Array.from(new Set(all_tank_raw));
// console.log(all_tank_raw);
// console.log(all_tank);

const all_tank_arr = [
  tanklist1,
  tanklist2,
  tanklist3,
  tanklist4,
  tanklist5,
  tanklist6,
  tanklist7,
  tanklist8,
  tanklist8,
  tanklist9,
];
