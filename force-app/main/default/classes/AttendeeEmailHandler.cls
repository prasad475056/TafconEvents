public with sharing class AttendeeEmailHandler {
    public static void sendConfirmationEmailsToAttendees(list<Event_Attendee__c> recordsTosendEmails){
        set<id> eventIds = new set<id>();
        set<id> AttendeeIds = new set<id>();
        for(Event_Attendee__c ea : recordsTosendEmails){
            eventIds.add(ea.Event__c);
            AttendeeIds.add(ea.Attendee__c);
        }
        map<id,Attendee__c> AttendeeMap = new  map<id,Attendee__c>( [select id,Name,Email__c,Location__c,Phone__c 
                                           			from Attendee__c 
                                           			where id in : AttendeeIds]);
        map<id,Event__c> EventMap = new map<id,Event__c>([select id,Name__c,Start_Date_Time__c,Event_Organizer__r.Name,
                                                          Location__r.Name,
                                                          Location__r.Street__c,
                                                          Location__r.State__c,
                                                          Location__r.Postal_code__c,
                                                          Location__r.City__c,
                                                          Location__r.Country__c 
                                                          from Event__c
                                                          where id in : eventIds ]);
        
        list<Messaging.SingleEmailMessage> emailList = new list<Messaging.SingleEmailMessage>();
        for(Event_Attendee__c ea : recordsTosendEmails){
            Event__c event = EventMap.get(ea.Event__c);
            Attendee__c Attendee = AttendeeMap.get(ea.Attendee__c);
            
           //messaging start here
           Messaging.SingleEmailMessage mail = new Messaging.SingleEmailMessage();
            String[] toAddresses = new String[] {Attendee.Email__c}; 
			mail.setToAddresses(toAddresses);
            mail.setSenderDisplayName('Tafcon Events');
            mail.setSubject('pass for the'+event.Name__c);
             String location = 'https://www.google.com/maps/place/'+event.Location__r.Street__c+''
                 												  +event.Location__r.City__c+''
                 												  +event.Location__r.State__c+''
                 												  +event.Location__r.Country__c+''
                 												  +event.Location__r.Postal_code__c;
            String hrefForLocation = '<a href="'+location+'"'+'target="_blank">Here</a>';
            string htmlbody = 'Dear'+Attendee.Name+',<br><br>'+
                              'Thank you for registering for'+event.Name__c+
                              'which will be organized on'+event.Start_Date_Time__c+
                              '&will be held in'+event.Location__r.Name+
                              '. we are Exited to have you,'+ 
                              'see you in the event....<br>'+
                	          'Find the Google Map Location for the Event'+hrefForLocation+'<br><br><br>'+
                              'Thanks,<br/>'+event.Event_Organizer__r.Name;
            
                mail.setHtmlBody(htmlbody);
                emailList.add(mail);
            
        }
        try{
              List<Messaging.SendEmailResult> results = messaging.sendEmail(emailList, false);
              for(Messaging.SendEmailResult email : results){
                 system.debug(email.isSuccess());
                if(!email.isSuccess()){
                     List<Messaging.SendEmailError> errors = email.getErrors();
                    TransactionLogHandler.doHandleExceptionWithError(JSON.serialize(errors), 'EventAttendeeTriggerHandler');
                }
             }
        }catch(system.Exception ex){
             TransactionLogHandler.doHandleException(ex, 'EventAttendeeTriggerHandler');
        }
        
    }	
}