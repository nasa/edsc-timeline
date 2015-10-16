afterEach ->
  # Clean up the timeline
  if @$tl?
    @$tl.timeline('destroy') if @$tl.data('timeline')
    @$tl.off().remove()
