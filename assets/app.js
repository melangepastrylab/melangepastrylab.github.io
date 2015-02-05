var main = function() {

  // disable stripe button
  var button = $('#customButton');
  if (button) {
    button.prop('disabled', true);
  }

  var getMetadata = function() {
    var metadata = {};
    metadata.fullName = $.trim($('#fullName').val());
    metadata.pickupDate = $('#pickupDate').val();
    metadata.mailingList = $('#mailingList').prop('checked');
    return metadata;
  }


  // metadata triggers
  var updateMetadata = function() {
    var metadata = getMetadata();

    if (metadata.fullName.length > 0
       && metadata.pickupDate !== "NotEntered") {

      // set metadata
         /*
      var stringified = JSON.stringify(metadata);
      $('input[name=metadata]').val(stringified);
      */

      // re-enable submit button
      $('#customButton').prop('disabled', false);
    } else if (metadata.fullName.length === 0
        || metadata.pickupDate === "NotEntered") {
      // disable submit button
      $('#customButton').prop('disabled', true);
    }
  }

  var getQuantity = function() {
    return $('#quantity').val();
  }

  var getAmountCents = function() {
    var quantity = getQuantity();
    var amount = quantity * 1500; // cents
    return amount;
  }

  /*
   * use token and other args to call out to heroku server which wil call
   * out to stripe to make payment
   */
  var onTokenRecv = function(token) {

    /* token
     * Object {id: "tok_15ShfjE9X8U61k3SjXKMqDfv", livemode: true, created: 1423112123, used: false, object: "token"…}card: Objectclient_ip: "107.192.0.177"created: 1423112123email: "mericsson@gmail.com"id: "tok_15ShfjE9X8U61k3SjXKMqDfv"livemode: trueobject: "token"type: "card"used: falseverification_allowed: true}
     */

    var metadata = getMetadata();

    var data = {
      amount: getAmountCents(),
      description: 'i (spring 2015): a taste of macarons',
     /* metadata: getMetadata(),*/
      stripeToken: token.id,
      stripeTokenType: token.type,
      stripeEmail: token.email,
      fullName: metadata.fullName,
      pickupDate: metadata.pickupDate
    }

    debugger;

    // send to herokuapp
    $.ajax({
      type: 'POST',
      url: 'https://melange-checkout.herokuapp.com/',
      crossDomain: true,
      data: JSON.stringify(data),
      contentType: 'application/json',
      dataType: 'json',
      success: function(data) {
        //location.href = '/success.html';
      },
      error: function(data) {
        alert('failed:' + data);
        //location.href = 'error.html';
      },
    });
  };


    // get args off of page
    /*
    var fullName = $.trim($('#fullName').val());
    var pickupDate = $('#pickupDate').val();
    var mailingList = $('#mailingList').prop('checked');
    var quantity = $('#quantity').val();
    var amount = quantity * 1500; // cents
    var key = 'pk_live_lUrKXKuFxSYeqGbtqsjnytWd';
    */

    var stripeHandler = StripeCheckout.configure({
      key: 'pk_live_lUrKXKuFxSYeqGbtqsjnytWd',
      image: '/assets/melange_logo_small.png',
      token: function(token, args) {
        onTokenRecv(token, args);
      }
    });

    var openStripeHandler = function() {
      stripeHandler.open({
        name: 'melange pastry lab',
        description: 'i (spring 2015): a taste of macarons',
        amount: getAmountCents()
      });
    }


  /* bindings */
  $('#fullName').keyup(updateMetadata);
  $('#pickupDate').change(updateMetadata);
  $('#mailingList').change(updateMetadata);
  $('#customButton').on('click', openStripeHandler);

};

$(document).ready(main);
