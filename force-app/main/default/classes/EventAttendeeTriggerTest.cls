@isTest
public with sharing class EventAttendeeTriggerTest {
    @TestSetup
    static void makeData(){
        Event_Organizer__c org = new Event_Organizer__c(
            Name = 'will smith',
          Phone__c = '9505917323',
           Email__c = 'willSmith@gmail.com',
           Alternative_Email__c = 'willSmith5566@gmail.com',
           Alternative_Phone__c = '8975625894');
           
           insert org;

           Event__c event = new Event__c(
            Name__c = 'Trailblazers',  
            Status__c = 'Created',
            Event_Organizer__c = org.id,
            Event_Type__c = 'Virtual',
            Recurring__c = true,
            Frequency__c = 'Weekly',
            Max_Seats__c = 200,
            Live__c = true,
           
            Start_Date_Time__c = system.now().addDays(1),
            End_Date_Time__c =system.now().addDays(5)
           );  
           insert event;

           Attendee__c att = new Attendee__c(
            Name = 'Manohar',
            Phone__c = '9589458799',
            Email__c = 'manohar@gmail.com'
           );
           insert att;

           Event_Attendee__c ea = new Event_Attendee__c(
            Attendee__c = att.id,
            Event__c = event.id
           );
           insert ea;        
                  
    }
    @isTest
    static void sendEmailTest(){
        Test.startTest();
        try{
            integer i = 10/0;
        }catch(System.Exception ex ){
            
        }
        Test.stopTest();
    }
    
}