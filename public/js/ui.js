export default class UI {
  constructor (state, viz, parser) {
    this.state = state
    this.viz = viz
    this.parser = parser

    this.rateLimit = false
    this.lastClicked = null

    this.viz.on('nodeClick', (d) => {
      if (d.type !== 'ledger') return
      if (this.lastClicked) {
        console.log('payment from ' + this.lastClicked.identity + ' to ' + d.identity)
        d.destinationLedger = true
        const lastClicked = this.lastClicked
        $.ajax({
          url: '/payments',
          method: 'PUT',
          data: {
            source_ledger: this.lastClicked.identity,
            source_username: 'alice',
            source_password: 'alice',
            destination_ledger: d.identity,
            destination_username: 'bob',
            destination_password: 'bob'
          },
          complete: () => {
            lastClicked.sourceLedger = false
            d.destinationLedger = false
          }
        })
        this.lastClicked = null
      } else {
        this.lastClicked = d
        this.lastClicked.sourceLedger = true
      }
    })

    const gui = new dat.GUI()
    gui.add(this, 'rateLimit')
  }
}
