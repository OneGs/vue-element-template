describe('m-temp', function() {
  it('data', function() {
    const fn = jest.fn();
    fn.mockReturnThis().mockReturnValue(10).mockReturnValue(20).mockReturnValueOnce(30).mockReturnValueOnce(40);

    expect(fn()).toEqual('ss');
  });
});
