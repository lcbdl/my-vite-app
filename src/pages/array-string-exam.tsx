import { Card } from "@/components/ui/card";

// Two Sum - Find two numbers in an array that add up to a target.
export const twoSum = (arr: number[], target: number): number[][] => {
  const map = new Map<number, number>();
  const result: number[][] = [];

  for (let i = 0; i < arr.length; i++) {
    const complete = target - arr[i];
    if (map.has(complete)) {
      result.push([map.get(complete)!, i]);
    } else {
      map.set(arr[i], i);
    }
  }
  return result;
};

// Best Time to Buy and Sell Stock - Maximize profit by buying low and selling high.
export const maxProfit = (arr: number[]): number => {
  if (arr.length < 2) return -1;
  let maxProfit = -1;
  let minPrice = arr[0];
  for (let i = 1; i < arr.length; i++) {
    if (arr[i] >= minPrice) {
      maxProfit = Math.max(maxProfit, arr[i] - minPrice);
    } else {
      minPrice = arr[i];
    }
  }
  return maxProfit;
};

// Longest Substring Without Repeating Characters - Find the length of the longest unique substring.
export const longestUniqueSubstringLength = (value: string): number => {
  const set = new Set<string>();
  let left = 0;
  let maxLength = 0;

  for (let right = 0; right < value.length; right++) {
    const char = value[right];

    // char in the set, shrink the window until char is removed from the set.
    while (set.has(char)) {
      set.delete(value[left]);
      left++;
    }

    set.add(char);
    maxLength = Math.max(maxLength, right - left + 1);
  }
  return maxLength;
};

export const longestUniqueSubstring = (value: string): string => {
  const map = new Map<string, number>();
  let longestSubStr = "";
  let left = 0;

  for (let right = 0; right < value.length; right++) {
    const char = value[right];
    while (map.has(char)) {
      map.delete(value[left]);
      left++;
    }

    map.set(char, right);
    const newSubstr = value.substring(left, right + 1);
    if (newSubstr.length > longestSubStr.length) {
      longestSubStr = newSubstr;
    }
  }
  return longestSubStr;
};

// Valid Parentheses - Check if a string has balanced brackets.
export const validParentheses = (value: string) => {
  const map = new Map([
    ["{", "}"],
    ["[", "]"],
    ["(", ")"],
    ["<", ">"],
  ]);
  const stack: string[] = [];

  let tmp = value.replace(/[^\{\}\[\]\(\)\<\>]/g, "");
  for (let i = 0; i < tmp.length; i++) {
    const char = tmp[i];
    if (map.has(char)) {
      stack.push(char);
    } else {
      const righParenthese = stack.pop();
      if (!righParenthese || map.get(righParenthese) !== char) {
        return false;
      }
    }
  }
  return stack.length === 0;
};

// Merge Intervals - Merge overlapping intervals.
export const mergeIntervals = (arr: number[][]) => {
  arr.sort((a, b) => a[0] - b[0]);
  const merged: number[][] = [];
  let prev = arr[0];
  for (let i = 1; i < arr.length; i++) {
    const curr = arr[i];
    if (prev[1] >= curr[0]) {
      prev[1] = Math.max(prev[1], curr[1]);
    } else {
      merged.push(prev);
      prev = curr;
    }
  }
  merged.push(prev);
  return merged;
};

// Container With Most Water - Find two lines that form the largest container.
export const containerWithMostWater = (heights: number[]): number => {
  let max = 0;
  let left = 0;
  let right = heights.length - 1;
  while (left < right) {
    const width = right - left;
    const area = Math.min(heights[left], heights[right]) * width;
    max = Math.max(max, area);
    if (heights[left] < heights[right]) {
      left++;
    } else {
      right--;
    }
  }
  return max;
};

// Check if 2 string are anagram
export const isAnagram = (str1: string, str2: string) => {
  const normalize = (str: string) => str.replace(/\s+/g, "").toLowerCase();

  const s1 = normalize(str1);
  const s2 = normalize(str2);

  if (s1.length !== s2.length) return false;

  const count: { [key: string]: number } = {};

  for (let i = 0; i < s1.length; i++) {
    const char = s1[i];
    count[char] = (count[char] || 0) + 1;
  }

  for (let i = 0; i < s2.length; i++) {
    const char = s2[i];
    if (!count[char]) {
      return false;
    }
    count[char]--;
  }

  return true;
};

//Group Anagrams - Group strings that are anagrams of each other.
export const groupAnagrams = (arr: string[]) => {
  const tmpArr = [...arr];
  const result: string[][] = [];
  while (tmpArr.length > 0) {
    const subArr: string[] = [tmpArr[0]];
    const firstStr = tmpArr.splice(0, 1)[0];
    let i = 0;
    while (i < tmpArr.length) {
      if (isAnagram(firstStr, tmpArr[i])) {
        subArr.push(tmpArr[i]);
        tmpArr.splice(i, 1);
      } else {
        i++;
      }
    }
    result.push(subArr);
  }
  return result;
};

// Longest Palindromic Substring - Find the longest palindrome in a string
export const longestPalindromicSubstring = (s: string) => {
  if (s.length === 1) return s;

  const isPalindromicString = (str: string) => {
    return str === str.split("").reverse().join("");
  };

  let left = 0;

  let result = "";
  while (left < s.length - result.length) {
    for (let right = left + 1; right <= s.length; right++) {
      const substr = s.substring(left, right);
      if (isPalindromicString(substr)) {
        if (substr.length > result.length) {
          result = substr;
        }
      }
    }
    left++;
  }
  return result;
};

// 3Sum problem — finding all unique triplets that sum to zero
export const threeSum = (arr: number[]): number[][] => {
  const results: number[][] = [];
  for (let i = 0; i < arr.length - 3; i++) {
    const rightArr = arr.splice(i + 1);
    const twoSumArr = twoSum(rightArr, 0 - arr[i]);
    if (twoSumArr.length > 0) {
      twoSumArr.forEach((twoSum) => results.push([arr[i], ...twoSum.map((j) => rightArr[j])]));
    }
  }
  return results;
};

// Trapping Rain Water - Calculate how much water can be trapped between bars.
export const trappedWater = (arr: number[]) => {
  let water = 0;
  let leftMax = arr[0];
  let rightMax = arr[arr.length - 1];
  let left = 1;
  let right = arr.length - 2;

  while (left < right) {
    if (arr[left] < leftMax) {
      water += leftMax - arr[left];
    } else {
      leftMax = arr[left];
    }

    if (arr[right] < rightMax) {
      water += rightMax - arr[right];
    } else {
      rightMax = arr[right];
    }

    // Whichever is smaller moves to the other way.
    if (arr[left] < arr[right]) {
      left++;
    } else {
      right--;
    }
  }
  return water;
};

const printArray = (arr: any[]) => `[${arr.toString()}]`;

export const ArrayStringExamPage = () => {
  const towSumresult = twoSum([1, 2, 3, 4, 5, 6], 11).map((item) => `[${item.toString()}]`);
  const maxProfitResult = maxProfit([3, 4, 5, 4, 2, 4, 5, 6, 7, 8]);
  const longestUniqueSubstringLengthResult = longestUniqueSubstringLength("abcabcddefgddsadsesdfagsdsawe");
  const longestUniqueSubstringResult = longestUniqueSubstring("abcabcddefgddsadsesdfagsdsawe");
  const validParenthesesResult = validParentheses("{ddsadsesdf[ag(sds)aw]e}{2*3}");
  const mergeIntervalsResult = mergeIntervals([
    [1, 3],
    [2, 5],
    [8, 10],
    [9, 12],
    [14, 23],
  ]);
  const containerWithMostWaterResult = containerWithMostWater([1, 8, 6, 2, 5, 4, 8, 3, 7]);
  const trappedWaterResult = trappedWater([0, 1, 0, 2, 1, 0, 1, 3, 2, 1, 2, 1]);
  const isAnagramResult = isAnagram("abedsf", "aebfds");
  const groupAnagramsResult = groupAnagrams(["eat", "tea", "tan", "ate", "nat", "bat", "tab"]);
  const longestPalindromicSubstringResult = longestPalindromicSubstring("dddd12345543");
  const threeSumResult = threeSum([-1, 0, 1, 2, -1, -4, 5]).map((item) => `[${item.toString()}]`);

  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-3 p-6">
      <h1 className="my-5 text-3xl font-bold">Array and String related exams</h1>

      <Card title="Two Sum">
        <p>Input array: {printArray([1, 2, 3, 4, 5, 6])}</p>
        <p>Target: 11</p>
        <p>Output: {towSumresult.join(", ")}</p>
      </Card>

      <Card title="Max Profit, Best Time to Buy and Sell Stock">
        <p>Input array: {printArray([3, 4, 5, 4, 2, 4, 5, 6, 7, 8])}</p>
        <p>Output: {maxProfitResult}</p>
      </Card>

      <Card title="Longest Substring Without Repeating Characters (length)">
        <p>Input string: {"abcabcddefgddsadsesdfagsdsawe"}</p>
        <p>Output: {longestUniqueSubstringLengthResult}</p>
      </Card>

      <Card title="Longest Substring Without Repeating Characters (substring)">
        <p>Input string: {"abcabcddefgddsadsesdfagsdsawe"}</p>
        <p>Output: {longestUniqueSubstringResult}</p>
      </Card>

      <Card title="Valid Parentheses">
        <p>Input string: {"{ddsadsesdf[ag(sds)aw]e}{2*3}"}</p>
        <p>Output: {validParenthesesResult ? "true" : "false"}</p>
      </Card>

      <Card title="Merge Intervals">
        <p>
          Input:{" "}
          {printArray([
            [1, 3],
            [2, 5],
            [8, 10],
            [9, 12],
            [14, 23],
          ])}
        </p>
        <p>Output: {printArray(mergeIntervalsResult)}</p>
      </Card>

      <Card title="Container With Most Water">
        <p>Input: {printArray([1, 8, 6, 2, 5, 4, 8, 3, 7])}</p>
        <p>Output: {containerWithMostWaterResult}</p>
      </Card>

      <Card title="Is Anagram">
        <p>Input: "abedsf", "aebfds"</p>
        <p>Output: {isAnagramResult ? "true" : "false"}</p>
      </Card>

      <Card title="Group Anagrams">
        <p>Input: {printArray(["eat", "tea", "tan", "ate", "nat", "bat", "tab"])}</p>
        <p>Output: {groupAnagramsResult.map((group: string[]) => `[${group.join(", ")}]`).join(", ")}</p>
      </Card>

      <Card title="Longest Palindromic Substring">
        <p>Input: {"dddd12345543"}</p>
        <p>Output: {longestPalindromicSubstringResult}</p>
      </Card>

      <Card title="3 Sum">
        <p>Input: {printArray([-1, 0, 1, 2, -1, -4, 5])}</p>
        <p>Output: {threeSumResult.join(", ")}</p>
      </Card>

      <Card title="Trapping Rain Water">
        <p>Input: {printArray([0, 1, 0, 2, 1, 0, 1, 3, 2, 1, 2, 1])}</p>
        <p>Output: {trappedWaterResult}</p>
      </Card>
    </div>
  );
};
