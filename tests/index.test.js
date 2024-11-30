function sum(a,b){
    return a+b;
}


test('add 1 + 2 equals 3',()=>{
    let ans = sum(1,2);
    expect(ans).toBe(3);
})
