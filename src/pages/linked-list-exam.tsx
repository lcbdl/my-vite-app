type Node = { value: number; next?: Node };

const createList = (values: number[]): Node => {
  const root: Node = { value: values[0] };
  let p = root;
  for (let i = 1; i < values.length; i++) {
    const node: Node = { value: values[i] };
    p.next = node;
    p = node;
  }
  return root;
};

const printList = (root: Node) => {
  const values: number[] = [];
  let p: Node | undefined = root;
  while (p !== undefined) {
    values.push(p.value);
    p = p.next;
  }
  return `[${values.join(", ")}]`;
};

// 1. Reverse a Linked List – Iterative and recursive approaches.
const reverseListInerative = (head: Node): Node => {
  let curr: Node | undefined = head;
  let prev: Node | undefined = undefined;
  while (curr !== undefined) {
    const next: Node | undefined = curr.next;
    curr.next = prev;
    prev = curr;
    curr = next;
  }
  return prev!;
};
const reverseListRecursive = (head: Node): Node => {
  if (!head || !head.next) {
    return head;
  }

  const newHead = reverseListRecursive(head.next);

  head.next.next = head;
  head.next = undefined;
  return newHead;
};

// 2. Merge Two Sorted Lists – Combine two sorted linked lists.
const mergeSortedList = (p1?: Node, p2?: Node) => {
  let dummy: Node = { value: -1 };
  let curr: Node = dummy;

  while (p1 && p2) {
    if (p1.value < p2.value) {
      curr.next = p1;
      p1 = p1.next;
    } else {
      curr.next = p2;
      p2 = p2.next;
    }
    curr = curr.next;
  }
  curr.next = !!p1 ? p1 : p2;
  return dummy.next;
};
// 3. Linked List Cycle – Detect if a linked list has a cycle (Floyd’s Algorithm).
const detectCycle = (head: Node) => {
  let slow: Node = head;
  let fast: Node | undefined = head;
  while (fast && fast.next) {
    slow = slow.next!;
    fast = fast.next.next;
    if (slow === fast) {
      return true;
    }
  }
  return false;
};

// 4. Remove Nth Node From End – Delete the nth node from the end.

const removeNthNodeFromEnd = (head: Node, n: number) => {
  let fast: Node | undefined = head;
  let slow: Node | undefined = head;
  for (let i = 0; i < n; i++) {
    fast = fast?.next;
    if (!fast) {
      throw new Error("Linked list is not longer than " + n + " nodes.");
    }
  }

  while (fast?.next) {
    slow = slow?.next;
    fast = fast.next;
  }

  slow!.next = slow?.next?.next;
  return head;
};

// 5. Add Two Numbers – Add two numbers represented as linked lists.
// Input:  (2 → 4 → 3) + (5 → 6 → 4)
// Output: 7 → 0 → 8
const addTwoNumbers = (head1?: Node, head2?: Node) => {
  const dummy: Node = { value: -1 };
  let curr: Node | undefined = dummy;
  let carry = 0;
  while (head1 || head2 || carry > 0) {
    const sum = (head1?.value ?? 0) + (head2?.value ?? 0) + carry;
    carry = Math.floor(sum / 10);
    const node: Node = {
      value: sum % 10,
    };
    curr.next = node;
    curr = curr.next;
    head1 = head1?.next;
    head2 = head2?.next;
  }
  return dummy.next;
};

export const LinkedListExam = () => {
  const data1 = [2, 3, 1, 5, 3, 7, 6, 9];
  const data2 = [1, 2, 4, 6];
  const data3 = [1, 5, 7, 8, 9];

  return (
    <div style={{ fontFamily: "monospace", lineHeight: 1.7 }}>
      <h2>Linked List Exam</h2>
      <div>
        <h3>1. Reverse a Linked List</h3>
        <div>
          <strong>Input:</strong> {printList(createList(data1))}
        </div>
        <div>
          <strong>Iterative Output:</strong> {printList(reverseListInerative(createList(data1)))}
        </div>
        <div>
          <strong>Recursive Output:</strong> {printList(reverseListRecursive(createList(data1)))}
        </div>
      </div>
      <div>
        <h3>2. Merge Two Sorted Lists</h3>
        <div>
          <strong>Input 1:</strong> {printList(createList(data2))}
        </div>
        <div>
          <strong>Input 2:</strong> {printList(createList(data3))}
        </div>
        <div>
          <strong>Output:</strong> {printList(mergeSortedList(createList(data2), createList(data3))!)}
        </div>
      </div>
      <div>
        <h3>3. Linked List Cycle Detection</h3>
        <div>
          <strong>Input:</strong> {printList(createList(data1))}
        </div>
        <div>
          <strong>Output:</strong> {detectCycle(createList(data1)).toString()}
        </div>
        <div>
          <strong>Cycle Example Output:</strong>{" "}
          {(() => {
            // Create a cycle for demonstration
            const list = createList([1, 2, 3]);
            let tail = list;
            while (tail.next) tail = tail.next;
            tail.next = list; // create cycle
            return detectCycle(list).toString();
          })()}
        </div>
      </div>
      <div>
        <h3>4. Remove Nth Node From End</h3>
        <div>
          <strong>Input:</strong> {printList(createList(data1))}
        </div>
        <div>
          <strong>n:</strong> 3
        </div>
        <div>
          <strong>Output:</strong> {printList(removeNthNodeFromEnd(createList(data1), 3))}
        </div>
      </div>
      <div>
        <h3>5. Add Two Numbers</h3>
        <div>
          <strong>Input 1:</strong> [2, 4, 3]
        </div>
        <div>
          <strong>Input 2:</strong> [5, 6, 4]
        </div>
        <div>
          <strong>Output:</strong> {printList(addTwoNumbers(createList([2, 4, 3]), createList([5, 6, 4]))!)}
        </div>
      </div>
    </div>
  );
};
