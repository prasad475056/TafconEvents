@isTest
public with sharing class EventBatchDeleteTestHandler {
   @TestSetup
   static void makeData(){

    Event_Organizer__c org = new Event_Organizer__c(
            Name = 'will smith',
          Phone__c = '9505917323',
           Email__c = 'willSmith@gmail.com',
           Alternative_Email__c = 'willSmith5566@gmail.com',
           Alternative_Phone__c = '8975625894');  
           insert org;

       list<Event__c> EventListToTest = new list<Event__c>();
        for(integer i=1 ; i <= 200; i++){
            Event__c event = new Event__c(
                Name__c = 'TestEvent'+i,  
                Status__c = 'Created',
                Event_Organizer__c = org.id,
                Event_Type__c = 'Virtual',
                Recurring__c = true,
                Frequency__c = 'Weekly',
                Max_Seats__c = 200,
                Live__c = true,    
                Start_Date_Time__c = system.now().addMonths(-4),
                End_Date_Time__c =system.now().addDays(3).addMonths(-4)
               );  
               EventListToTest.add(event);
        }
        insert EventListToTest;
   } 
   @istest
   public static void callBatchClassTest(){
    test.startTest();
    id jobid = Database.executeBatch( new EventBatchDeleteHandler(), 250);
    test.stopTest();
   }
}