function GenericErrorModal() {
  Modal(
    document.body,
    {
      title: 'Whoops!',
      content: "There was an error of some sort. Try refreshing or asking for help in discord."
        + " And you can always fall back to the original spreadsheet!",
    }
  );
}
