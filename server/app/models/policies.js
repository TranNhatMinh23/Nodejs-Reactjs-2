const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PolicySchema = new Schema({
    alias: { type: String, required: true },
    status: { type: String, enum: ['Active', 'InActive'], default: 'InActive' },
    name: { type: String, required: true },
    version: { type: Number, required: true },
    content: { type: String },
    order: { type: Number, required: true },
},
    {
        timestamps: true
    })

const dataMigrate = [
    {
        alias: "TermAndCondition",
        status: "Active",
        name: "Term and Condition",
        version: 1.0,
        content: `DIGITAL PLATFORM TERMS AND CONDITIONS

            Welcome to Talent Town. Before you start enjoying our platform we have to set out the rules which will govern Talent Town’s relationship with you. We have done our best to make them as easy to understand as possible but if you have any questions at all, feel free to contact us at customersupport@talenttown.com.   
            
            WHO WE ARE
            
            We are Craw Road Limited, trading as Talent Town, a company incorporated and registered in England and Wales with company number 11657704. Our normal place of business is at Kemp House, 160 City Road, London, United Kingdom, EC1V 2NX (referred to as Talent Town, we, our and us).
            
            We are an online platform for instantly booking talent of any kind, safely and securely and in real time. Whether you are the customer or the talent, our custom technology enables you to transact directly, instantly and securely, giving you increased autonomy and flexibility over your bookings. Thank you for using our service.
            
            
            
            THESE TERMS
            
            In these terms and conditions (together with the documents referred to in them) (the Terms), we’ll refer to our Website, which refers to all our sites located at or accessible through www.talenttown.com, and our Progressive Web Application, which is accessible via our Website on desktop and mobile devices, together as our Platform. References to our Website include our owned sites, such as our customer service portal, but do not include links to third-party sites, such as the sites of our partners.
            
            These Terms govern your relationship with us when you access our Platform, so please make sure to read them carefully before you start accessing the Platform. Once you start using our Platform you are taken to have understood and accepted these Terms. We don’t expect you to memorise these Terms but they will form a binding agreement between you and us so if you have any questions, please let us know.
            
            At Talent Town, you are either a person or organization looking to book a service provider for your gig (the Customer) or you are a service provider looking to perform at a gig (the Talent). If we are talking about Customers and Talent together, we will refer to you collectively in these Terms as Users.
            
            OTHER APPLICABLE TERMS
            
            These Terms also include our Privacy Policy [insert hyperlink to privacy policy] (the Privacy Policy). You should read the Privacy Policy as it sets out the terms on which we process (collect, use, share, etc.) any personal data we collect from you or that you provide to us and how we will communicate with you via the Platform.
            
            CHANGES TO THESE TERMS
            
            We may from time to time amend these Terms to ensure that we remain compliant with relevant laws and regulations or to keep up to date with improvements or changes we might make to the services and experiences we can offer to you via our Platform. If we make significant changes to these Terms or to the services within the Platform, we will let you know what these significant changes are and you may contact us at customersupport@talenttown.com if you have queries regarding these significant changes.
            
            We don't expect you to check these Terms every time you use our Platform but equally, we don't want to bombard you with every little update. We just ask that you check this page from time to time to take notice of any changes we have made. This is important because by continuing to use any of the Platform after changes are made, you are accepting those changes and will be bound by them.
            
            THE PLATFORM
            
            Our Platform is structured so that you are able to access it via any compatible device of your choosing, whether on desktop, mobile or tablet.
            
            When you reach our Platform, you can use it to:
            
            ·       create a personal account;
            
            ·       view and engage with Content (which means any audio, video, text, images, trademarks, logos or other content which may be made available to you by us and may sometimes include content which is owned or controlled by third parties which we are permitted to make available to you);
            
            ·       if you are a Customer, search for and book Talent in accordance with the Talent’s selected booking mechanism (e.g. instant bookings or ´request to book’);
            
            ·       if you are Talent, accept bookings or liaise with Customers to finalise gig booking details; and
            
            ·       receive notifications via push notifications, emails, SMS and when using the Platform. These messages may include information about your account, our content, the community, gigs and general product information. You can control your preferences from your settings;
            
            ·       provide you with a platform to refer us to other people;
            
            ·       click on links to our social media channels, such as on Facebook and Instagram;
            
            ·       access customer support from our support team; and
            
            ·       access our legal and data protection policies.
            
            Please refer to our Privacy Policy [insert hyperlink to privacy policy] for more information on how we process your personal data.
            
            The list above is not necessarily a complete list of the functions of the Platform and we may decide to offer additional functions, or stop providing any Platform functions, at any time.
            
            TALENT VETTING: QUALITY CHECKS
            
            In order to ensure that Talent are suitable for the Platform, Talent may be subject to a quality vetting process before they are accepted onto the Platform (Quality Checks). We will conduct Quality Checks as we deem appropriate, in accordance with Talent Town’s Privacy Policy and applicable laws. We retain full and sole discretion as to whether Talent is accepted on to the Platform or not. You agree that you will have no claim or action against us, if we choose not to accept you as Talent on to the Platform, whether as a result of Quality Checks or otherwise. We cannot always provide reasons for not accepting Talent, although we will make efforts to do so where we feel it would be fair or appropriate.
            
            TALENT VETTING: IDENTITY CHECKS
            
            
            
            Before they can start earning money on the Platform, Talent may be subject to a further vetting process, including but not limited to a verification of identity, right to work checks and criminal background checks, using third party services as we deem appropriate (Identity Checks). We will conduct Identity Checks as we deem appropriate, in accordance with Talent Town’s Privacy Policy and applicable laws. We retain full and sole discretion as to whether Talent is accepted on to the Platform or not. You agree that you will have no claim or action against us, if we choose not to accept you as Talent on to the Platform, whether as a result of Identity Checks or otherwise. We cannot always provide reasons for not accepting Talent, although we will make efforts to do so where we feel it would be fair or appropriate.
            
            OUR ROLE IN BOOKINGS
            
            Our Platform exists to connect Customers with Talent. Once a connection between Users is made and a booking process is initiated, our involvement is limited to our obligations as set out in these Terms and anything beyond these obligations is beyond our reasonable control. As such we cannot be held responsible for the actions or omissions of Customers or Talent outside of the Platform. When a Customer makes a booking with Talent, both parties acknowledge that they form a contract between them which Talent Town is not a party to. Talent Town is an intermediary in that arrangement, but cannot guarantee the performance by either party of their respective obligations under it. Talent Town holds no liability to Users beyond what is stated in these Terms. 
            
            Procedures for complaints and refunds are clearly set out in these Terms or stated clearly on our Website. If Users wish to make claims of any nature or any form of claim beyond the remit of the Talent Town complaints system, then any such claim must be made off the Platform with the relevant competent authorities. Talent Town is not and will not be at any time a party to the contract between a Customer and Talent that is concluded via the Platform or otherwise executed directly between Talent and a Customer during or after their use of the Platform.
            
            REGISTRATION
            
            
            
            To use the Platform, you will have to sign up to create an account. Users can create an account by signing in using one of the provided social media log-ins or by providing your full name; email and/or mobile phone number; date of birth (if you are an individual) and confirmation of whether you are a company or an individual. We require your date of birth to confirm you are legally able to use our service – you must be at least 16 years old to register as a User. However, if you are under 18 years old, you will be required to confirm that you have your parent or guardian’s permission to register and in the case of Talent, upload Content to the Platform.
            
            If you wish to be Talent, at this stage you will be able to upload photos, videos and other information relevant to your talent. These uploads will be subject to our Privacy Policy and Code of Conduct. The Content you upload will then be screened by our team for quality and if you are successful in passing that quality screening then you will be given access to the dashboard on the Platform and be able to continue the registration process. Your registration as Talent is also conditional on successfully passing our compulsory Identity Checks which you will be prompted to take during the registration process, and then continuously complying with the requirements of the Identity Checks on an ongoing basis.
            
            After registering, Users can sign in to our Platform using their email address and password provided. By signing up with us you agree to any applicable terms of the service, including these Terms. Please note that, if you are Talent, we reserve the right to temporarily remove your profile information from the Platform if we believe it is appropriate or necessary to do so (for example if it infringes someone’s intellectual property or impersonates another user or is being allocated to a publicly-known individual).
            
            Talent will have the opportunity to select from different membership plans, booking options and cancellation policies (the ‘Talent Options’), which will be made clear at the time of registration. We reserve the right to amend the details of the Talent Options provided at the registration stage at any time and will notify you in advance if we plan to do so.
            
            All Users must provide truthful and accurate information when registering with us – this helps us provide you with the best service. Any incorrect or untruthful information provided by Talent (including with respect to Content) may render a booking void and any refund due after a gig as a result of false and/or inaccurate information provided by the Talent will be entirely the responsibility of the Talent. Any Insurance policy we have organised for you on your behalf with respect to the voided booking will also be void as a result of having provided false or inaccurate information. We reserve the right to take any action necessary with respect to your access to the Platform as a result, including reporting you to relevant authorities in certain severe situations.
            
            Users are responsible for looking after the security of their account information. This means that you are responsible for all activities that happen on your account and for any access to or use of the Platform by you or any person using your account even if that access or use has not been authorised by you.
            
            Please immediately notify us of any unauthorised use of your account or any other breach of security relating to the Platform. We are not responsible for any loss or damage caused by the disclosure of your account details to someone else.
            
            You are responsible for ensuring that the information we hold about you is up to date. Please amend your details as appropriate from time to time to notify us of any changes.
            
            
            
            PAYMENT AND BOOKINGS
            
            PAYMENT
            
            This section describes how fees are payable for use of the Platform. Our fees (which will be inclusive of any applicable sales taxes) are outlined clearly on the Platform and the total cost will be made clear to you prior to confirming a booking.
            
            Customers are required to pay a trust and support fee to Talent Town for each booking. The amount of such fee will be made clear to the Customer at the time of booking. This fee is non-refundable.
            
            Once a Customer has made a booking, the Customer may pay for the Talent booking either: (i) in full at the time of the booking. ; or (ii) in two instalments. If paying in instalments per option (ii), 50% of the total cost of the booking must be made at the time of the booking and the remaining 50% of the total cost will be deducted automatically from the credit card, or other payment method you provide to us, 14 days before the date of the booking. If the date of the booking is less than 14 days (inclusive) before the gig, only option (i) (full upfront payment) is available to the Customer.
            
            If a Customer chooses to pay in instalments and payment of the second instalment is unsuccessful within the prescribed deadline, you will have 3 additional days within which to update your payment method before the booking will be cancelled (Grace Period). Customers will receive a sequence of reminder emails that such payment is outstanding within that Grace Period. You will not be entitled to a refund the first instalment or the trust and support fee we charge for each booking if the second instalment remains unpaid after the Grace Period, although we reserve the right to deal with such situations as we see fit in our discretion on a case by case basis.
            
            All payments will be made via a third party payment collection agent (e.g. StripeConnect), accessible via the Platform (the Payment Service). You may use all major debit and credit cards. , Apple Pay and Google Pay wallet payments and PayPal on the Payment Service. [Note: Anjan and Ross to check before launch]
            
            You agree that all payments made on the Platform will be made via the Payment Service. Offline, cash or any other payments made not using the Payment Service are strictly prohibited and may result in your removal from the Platform and in any case will void the Talent Town Guarantee, details of which can be found [insert hyperlink to Talent Town Guarantee].
            
            All payments made will be held in escrow by a third-party provider until successful completion of a gig.
            
            After the gig, the Customer has 24 hours to inform Talent Town of any problems with the booking. If 24 hours pass and no problem or complaint is reported, full payment will be transferred to the Talent either (i) within 48 hours of the completion of the relevant gig (net of any fees and/or commission due to Talent Town) where the Customer booked the gig and paid in full at least 5 full days in advance of the gig; or (ii) within 5 days of completion of the relevant gig (net of any fees and/or commission due to Talent Town) where the Customer booked the gig and paid in full less than 5 full days in advance of the gig. Please note that these timings may vary where it takes longer for payments to clear through our Payment Service. Where this is the case, we will use our reasonable efforts to communicate this with Talent.
            
            Please note that Users must be legally authorised to make payments with your selected payment method. Where you believe an unauthorised payment has been made, please immediately contact your bank or other relevant authority and report this (although we cannot guarantee that your bank or other relevant authority will investigate). We will not deal with reports of unauthorised payments directly.
            
            BOOKINGS
            
            If the Talent choose request only bookings, Talent have 24 hours to respond to a booking (by either accepting or declining) before the attempted booking is automatically cancelled.
            
            If a Customer decides to cancel a gig, certain fees will apply depending on the cancellation policy selected by the Talent from the Talent Options. The Talent’s cancellation policy will be made clear to the Customer at the time of booking. The trust and support fee is non-refundable under any circumstances once a booking has been made (regardless of whether the booking is cancelled or whether a complaint is subsequently reported, unless Talent Town is the reason for the complaint, rather than a User) as this is required to cover our costs of each booking.
            
            If a Talent decides to cancel a gig, sanctions will apply depending on the proximity to the gig date of the cancellation. You can find our sanctions policy on our website at [INSERT RELEVANT LINK].
            
            In the event of a cancellation more than 48 hours before the gig, Talent Town will provide a refund or endeavour to find a replacement talent but does not guarantee a replacement or alternative. If a Talent cancels within 48 hours of the gig or does not show up to the gig, we will provide a refund and endeavour to find a replacement so that you have someone at your gig, but we cannot guarantee a replacement or alternative.
            
            Users agree that they will act at all times in good faith towards Talent Town, and not attempt to circumvent Talent Town at any point during the bookings process. Users agree that where an introduction is made via the Platform, that they will complete any subsequent bookings on the Platform. If Talent Town becomes aware of any attempts by Talent or a Customer to take a booking ‘offline’ so as to avoid any fees payable to Talent Town, then we reserve the right at all times to: (1) suspend or delete a User’s account; (2) make note of the User’s actions on the User’s profile on the Platform in a manner we deem appropriate, (3) invoice for any fees and/or commission as if the booking had been completed on the Platform, and/or (4) take any other action as we deem appropriate in the circumstances.
            
            PROMOTIONAL CODES
            
            We may from time to time provide certain promotional codes to Users, for example as one-off promotions or as part of a loyalty programme. You agree that you will use promotional codes only in accordance with these Terms, or any additional terms we put in place for the relevant promotional codes.
            
            Talent Town reserves the right to withhold or deduct credits or other features or benefits obtained through the use of a promotional code by you or any other User if we believe that the use or redemption of a promotional code was in error, fraudulent, illegal, or in violation of the terms of the promotional code or of these Terms.
            
            PLATFORM AND USER CONTENT LICENCE RESTRICTIONS
            
            This section tells you what you're not allowed to do on the Platform.
            
            Except as expressly allowed in these Terms, you may not:
            
            ·       copy the Platform or User Content (defined below);
            
            ·       transfer the Platform or User Content to anyone else, except where we make possible and encourage sharing;
            
            ·       sub-license or otherwise make the Platform or User Content available in whole or in part (and whether in object or source code form) to any person;
            
            ·       make any alterations to, or modifications of, the Platform or User Content; or
            
            ·       disassemble, decompile, reverse-engineer or create derivative works based on the whole or any part of the Platform or User Content or attempt to do so,
            
            (together the Platform and User Content Licence Restrictions).
            
            ACCEPTABLE USE RESTRICTIONS
            
            You may use the Platform only for lawful purposes and those outlined in these Terms. In particular, but without limitation, you agree not to:
            
            ·       use the Platform in any way that is unlawful or fraudulent, or has any unlawful or fraudulent purpose or effect;
            
            ·       use, share, or otherwise exploit the Platform any commercial, business, or monetised purpose whatsoever other than those purposes outlined in these Terms;
            
            ·       reproduce, duplicate, copy, share, or re-sell any part of the Platform in contravention of these Terms;
            
            ·       use the Platform in a way that could damage, disable, overburden, impair or compromise our systems or security or interfere with other members;
            
            ·       use the Platform in a way which we deem to be inappropriate or abusive or which could cause offence or distress in any way to any User, Talent Town staff-member or other person associated with our service;
            
            ·       upload any inappropriate or adult Content or pornography or be in any way associated with the adult industry on the Platform;
            
            ·       transmit any data, send or upload any material that contains viruses, Trojan horses, worms, time-bombs, keystroke loggers, spyware, adware or any other harmful programs or similar computer code designed to adversely affect the operation of the Platform; or
            
            ·       access without authority, interfere with, damage or disrupt (a) any part of the Website or the App; (b) any equipment or network on which the Website is stored; (c) any software used in the provision of the Website or the App; or (d) any equipment, network or software owned or used by any third party,
            
            (together the Acceptable Use Restrictions).
            
            In addition, if you are Talent, you agree to use the Platform in a way that will maintain trust between Talent and Customers by complying with certain obligations, which include, but are not limited to:
            
            ·       observing our Code of Conduct [insert hyperlink] (which applies at all times when using the Platform and performing at gigs);
            
            ·       responding to booking requests (where bookings are ‘request only’) within 24 hours of receipt of the request, unless there is a genuine and legitimate reason for not doing so;
            
            ·       using all reasonable efforts to avoid cancellations, unless there is a genuine and legitimate reason for doing so (and in which case you will be required to provide an explanation);
            
            ·       maintaining an overall high and consistent standard of performance, such that would be expected by Customers,
            
            (together the Talent Expectation Guidelines).
            
            TERMINATION OF YOUR RIGHTS
            
            We may end or suspend your rights under these Terms immediately and without notice if:
            
            ·        you have breached any of the Platform and User Content Licence Restrictions, Acceptable Use Restrictions and/or Talent Expectation Guidelines;
            
            ·        we believe that your use of the Platform on an independent occasion or on a continued basis is unsuitable or inappropriate in any way at our sole discretion; or
            
            ·        you are otherwise in breach of these Terms.
            
            If we end your rights under these Terms:
            
            ·        you must immediately stop all activities authorised by these Terms, including your access to and use of any or all of the Platform;
            
            ·        if we ask you to you must immediately delete or remove the Platform from all devices then in your possession, custody or control and, if required, confirm to us that you have done so; and
            
            ·        you will not be entitled to any refund as a result of your breach or unsuitable use.
            
            INTELLECTUAL PROPERTY RIGHTS AND USER CONTENT
            
            This section sets out who owns what in terms of the Platform. It also sets out how we will treat any content that you provide to us (the User Content) and what your obligations are in relation to that User Content. 
            
            You agree that:
            
            ·        the Platform and all material published on, in, or via them (including but not limited to the User Content) is owned and controlled by or licensed to us;
            
            ·        in respect of the User Content that you create, upload, send or post to us that:
            
            o   you retain the ownership rights in the User Content;
            
            o   you grant us a perpetual, royalty free, non-exclusive licence (including the right to grant sub-licences) to use, copy, distribute, reproduce and publish any and all User Content (including, without limitation, on our Website, on other websites, on physical products and in promotional and/or marketing material developed in each case whether developed by us or on our behalf);
            
            o   we may disclose your identity to any third party who claims that the User Content posted or uploaded by you defames them, constitutes a breach of their intellectual property rights or breaches their right to privacy; and
            
            o   you make your User Content available to us in the manner envisaged by these Terms without payment or other compensation to you, regardless of how we use the User Content.
            
            You represent and warrant on an ongoing basis that you:
            
            ·        are the owner or authorised licensee of all User Content;
            
            ·        have all necessary rights (including, but not limited to, all intellectual property rights) and consents required to publish the User Content and to grant us the rights in the User Content as set out in these Terms;
            
            ·        will not send us or post User Content that violates applicable law, regulations, these Terms or any other relevant Talent Town policy; and
            
            ·        have all required permissions and consents from any third party whose personal information is included in any User Content.
            
            INTERACTION AND REPORTING
            
            Our Platform enables Users to interact directly with each other once the booking process has been initiated. From time to time we may additionally make available interactive services at various stages of the booking process. All Users acknowledge and agree that they are responsible for their own interactions on the Platform. Talent Town does not directly control or fully moderate User Content in real time at the time of upload, and Users should use the reporting mechanism below to ensure that any harmful User Content is identified and addressed as efficiently as possible. Users acknowledge that Talent Town is at all times entitled and permitted to monitor and view all Users’ interactions within the Platform, including in direct messages between two or more Users.
            
            Please note that Talent Town is built and relied upon the trust and good faith of our Users. Any attempts to take interactions between Talent and Customers ‘offline’ in an attempt to circumvent fees due to Talent Town may result in (amongst other remedies available to Talent Town), applicable bookings becoming null and void, and existing and future Talent Town benefits (such as relating to the Talent Town Guarantee or promotions with our partners, including relating to insurance) being immediately retracted without notice.
            
            Once a booking has been completed and performed, our service requests you to leave a review of the User (i.e. Customers review Talent and Talent review Customers). If you are Talent, you will not be able to accept or receive another booking until you leave a review.
            
            Reporting mechanism: If you see any User Content which appears on our Platform which you find offensive, abusive or in any way inappropriate then please notify us as soon as possible. You can report any offensive, abusive or inappropriate User Content or communication between Users to us via customersupport@talenttown.com and request that any such User Content is removed or that the User communication is investigated. One of our team will then review your report and take any action we deem appropriate.
            
            For further information on the standards which we require all members to uphold, please refer to our Code of Conduct [insert hyperlink], which forms part of these Terms and are incorporated in them. In the case of any conflict between the Code of Conduct and these Terms, these Terms will take priority.
            
            AVAILABILITY OF THE PLATFORM
            
            The Platform is provided on an "as is" basis. We make no representations, warranties or guarantees of any kind regarding the availability or operation of the Platform, or that they will be secure, uninterrupted or free of defects.
            
            If we choose to conduct identity verification or background checks on any User, to the extent permitted by applicable law, we disclaim warranties of any kind, either express or implied, that such checks will identify prior misconduct by a User or guarantee that a User will not engage in misconduct in the future.
            
            Your access to any of the Platform may be suspended or restricted occasionally to allow for maintenance, repairs, upgrades, or the introduction of new functions or services. Availability of our Platform may also be interrupted in the case of events or occurrences beyond our reasonable control. We will not be liable to you if for any reason the Platform is unavailable at any time or for any period.
            
            CANCELLING OR AMENDING YOUR TALENT OPTIONS
            
            Within the Talent Options, Talent will have the ability to select paid-for membership plans (the Paid Plan). Paid Plans are offered on an annualised basis (starting from the date when we ask you to confirm your registration as Talent). You have the option to pay monthly or pay as a lump sum.
            
            If paying as a lump sum, the overall fee when spread across 12 months has approximately a 10% discount on the monthly rate (annualised) and is non-refundable, subject to the Cooling-Off Period (as defined below), and your subscription will renew after 12 months.
            
            If paying monthly, your subscription will renew monthly on the same day each month (or as close as possible to the same day each month). If you need to then cancel your Paid Plan, you can do so at any time. Contact us via the settings in your account and we can help you process your cancellation. Please remember that, subject to the Cooling-Off Period (as defined below),you will need to request cancellation of your Paid Plan at least three days before the start of your next billing cycle in order to avoid auto-renewal for the following month. Note that if you do cancel your Paid Plan, we reserve the right to charge you a re-activation fee if you want to return to Talent Town in future.
            
            If you do cancel your Paid Plan, you will: (i) revert to an unpaid plan; or (ii) be removed from the Platform, depending on the option you select when cancelling the Paid Plan.
            
            If you are a non-business Talent (i.e. signing up as an individual and not as part of a company, agency or similar) you have the statutory right to cancel your Paid Plan at any time within fourteen (14) days beginning on the day we email you to confirm your Paid Plan (the Cooling-Off Period), but ONLY IF you have not yet received a booking and/or performed an gig. As soon as you start to receive bookings via the Platform and perform at gigs, your statutory right to cancel your Paid Plan will expire.
            
            If you chose to pay as a lump sum, you will not be entitled to any refund in the event that you decide to cancel your Paid Plan after the Cooling-Off Period.
            
            If you have not yet started to receive bookings via the Platform and perform at gigs and you wish to exercise your statutory right to cancel your Paid Plan, please do so via your settings in the Platform. If you are experiencing difficulties with your cancellation contact us at customersupport@talent.town within the Cooling-Off Period and we will process a full refund of all Paid Plan fees paid by you during the Cooling Off Period. We will aim to process your refund within 14 days of you telling us you have changed your mind.
            
            For the avoidance of doubt, Talent which is a company, agency or similar will have no right to a Cooling-Off Period.
            
            ACCOUNT DELETION
            
            If you wish to terminate your membership with us, you can do so at any time by deleting your account, although please remember that you will not be refunded for payments already made if you choose to do so, other than the refund outlined in the ‘Cancelling or Amending Your Talent Options’ section above, if that section applies to you, and the Notice Period will apply if paying monthly. Once your membership is cancelled, we will send you a notification to confirm that the cancellation has occurred successfully.
            
            WEBSITES WE LINK TO
            
            The Platform may link to other third party websites from which third party services can be obtained. Whilst we reasonably believe that these are reputable sources of such services, you acknowledge that these other websites are independent from us and we make no representations or warranties as to the legitimacy, accuracy or quality of such third party services, and we do not accept any responsibility for their content, safety, practices or privacy policies. Essentially, we will do our best to ensure they are safe but you access any third party at your own risk.
            
            COMPUTER VIRUSES
            
            We do everything we can to ensure that no part of the Platform will contain or spread any viruses or other malicious code but this section explains how you can best protect your devices.
            
            We recommend that you ensure that equipment used to access the Platform run up-to-date anti-virus software as a precaution, and you are advised to virus-check any materials downloaded from the Platform (if applicable) and regularly check for the presence of viruses and other malicious code.
            
            To the full extent permitted by law we exclude liability for damage or loss of any kind caused by viruses or other harmful components originating or contracted from the Platform.
            
            INSURANCE
            
            Talent must have suitable public liability insurance for any services they provide to Customers. Talent Town makes available a basic level of public liability insurance (Basic Insurance) at the time of booking through [INSERT DETAILS OF BROKER/UNDERWRITER], details of which can be located at [insert link]. Talent should ensure they review and understand any exclusions to the Basic Insurance and seek assurance from the applicable insurance broker if they believe that the Basic Insurance may not cover Talent’s intended performance.
            
            Whilst we may work alongside accredited insurance brokers and underwriters (for example we may make a fixed package insurance policy available to you which may be purchased in line with one of our Paid Plans in conjunction with an accredited broker), we will under no circumstances be a party to any insurance policy or contract you put in place with an insurance underwriter via an accredited broker. Any claims made under such a policy or contract must be made directly with your broker and underwriter regardless of whether we have introduced you to them.
            
            NO RELIANCE ON INFORMATION
            
            All information published on or via the Platform is provided in good faith and for general information purpose only. We make no warranties about the completeness, reliability, or accuracy of such information. Any action you take based on such information is taken at your own risk.
            
            IF THERE IS A PROBLEM WITH THE PLATFORM
            
            If you have any questions or complaints about the Platform or User Content please contact us. You can contact us at customersupport@talent.town
            
            We are under a legal duty to provide a Platform that is in conformity with these Terms and have set out a summary of your key legal rights in relation to the Platform. Nothing in these Terms will affect your legal rights.
            
            Summary of key legal rights:
            
            a)     the Platform must be as described, fit for purpose and of a satisfactory quality;
            
            b)     if the Platform is faulty, you're entitled to a repair or replacement;
            
            c)      if the fault cannot be fixed, or if it hasn't been fixed within a reasonable time (e.g. one month) and without significant inconvenience, you can get some or all of your money back for the relevant time period; and
            
            d)     if you can show the fault has damaged your device, and we haven't used reasonable care and skill, you may be entitled to a repair or compensation (as set out in the section below).
            
            OUR RESPONSIBILITY FOR LOSS OR DAMAGE SUFFERED BY YOU
            
            We do not exclude or limit our liability to you where it would be unlawful to do so. This includes liability for death or personal injury caused by our negligence or the negligence of our employees, agents or subcontractors and for fraud or fraudulent misrepresentation.
            
            We provide the Platform for the purposes outlined in these Terms. You agree not to use any of them for any purpose not expressed or implied by these Terms, and we will have no liability to you for any loss of profit, loss of business, business interruption, or loss of business opportunity, or any indirect or consequential loss arising out of or in connection with these Terms.
            
            Except as set out in the paragraph above, you accept and agree we will not be liable for any harmful effect that accessing the Platform may have on you, and you agree that you access the Platform at your own risk.
            
            COMMUNICATIONS BETWEEN US
            
            If you wish to contact us for any reason, you can do so via customersupport@talenttown.com
            
            Other than to provide the services provided within our Platform, we will only contact you if we make any relevant updates or changes to our services, or where you have signed up for marketing communications. You may opt out of marketing communications at any time via your settings within the Platform.
            
            The Platform may use pop-up notifications, unless you disable them. Please note though that it is not possible to disable service information or error alerts.
            
            OTHER IMPORTANT TERMS
            
            This section provides all of the extra terms that we have to tell you about.
            
            We may transfer our rights and obligations under these Terms to another organisation, but this will not affect your rights or our obligations under these Terms. You may not assign or transfer any rights you may have under these Terms without our prior written approval, given at our absolute discretion.
            
            None of the rights or obligations under these Terms are enforceable under the Contracts (Rights of Third Parties) Act 1999 by a person who is not a party to these Terms.
            
            Under these Terms, you are granted a licence only in respect of our Platform. Any payments made are in consideration for a licence to access our Platform. We retain ownership in the Platform at all times.
            
            If we do not enforce our rights against you, or if we delay in doing so, that does not mean that we have waived our rights against you, and it does not mean that you are relieved of your obligations under these Terms. If we do waive a breach by you, we will only do so in writing, and that will not mean that we will automatically waive any later breach by you.
            
            No agency, partnership, joint venture, employer-employee or franchiser-franchisee relationship is intended or created by these Terms between Talent Town and the User.
            
            Each of the terms and conditions of these Terms operates separately. If any court or competent authority decides that any of them are unlawful or unenforceable, the remaining terms and conditions will remain in full force and effect. Subject to any applicable law and consumer rights, these Terms are the full agreement between us and our Users.
            
            These Terms are governed by English law and the courts of England and Wales have exclusive jurisdiction.
            
            Talent Town is a registered trademark of Craw Road Limited. All Talent Town trademarks, service marks, trade names, logos, domain names, and any other features of the Talent Town brand (“Talent Town Brand Features”) are the sole property of Talent Town or its licensors. These Terms do not grant you any rights to use any Talent Town Brand Features whether for commercial or non-commercial use.`,
        order: 1
    },
    {
        alias: "Privacy",
        status: "Active",
        name: "Privacy",
        version: 1.0,
        content: `Hello, welcome to the Talent Town Privacy Policy. At Talent Town, we are committed to keeping your personal information safe and secure, and handling it in accordance with our legal obligations. This Privacy Policy sets out in detail the purposes for which we process your personal information, what rights you have in relation to that information, who we share it with and everything else we think is important for you to be aware of.

        Please make sure you check it carefully and if you don’t agree with it, then (although we hate to turn you away) you shouldn’t use our Platform or services. This is because by accessing our Platform or services, you confirm that you accept the way in which we process your personal information. This privacy policy forms part of our Terms [insert hyperlink to Terms], and capitalised words and phrases in it have the same meaning as those in our Terms.
        
        If you have any concerns, please feel free to contact us at [insert email address].
        
        About Talent Town
        
        Talent Town is the trading name of Craw Road Limited, a company incorporated and registered in England and Wales with company number 11657704 (referred to as Talent Town, we, our and us). Our normal place of business is at Kemp House, 160 City Road, London, United Kingdom, EC1V 2NX. We are the data controller for the purposes of the personal information processed in accordance with this Privacy Policy.
        
        You can contact us regarding this Privacy Policy by email to [insert email address].
        
        Contents of this Privacy Policy: [Insert hyperlinks to each section]
        
        1.     About this Privacy Policy
        
        2.     The personal information we collect, how we collect it, and why
        
        3.     Our legal basis for processing personal information
        
        4.     When do we share your personal information?
        
        5.     Communications
        
        6.     How long do we store your personal information?
        
        7.     Security of your personal information
        
        8.     Links
        
        9.     Age restrictions
        
        10.  Your rights and choices
        
        11.  Contacting us
        
        12.  Cookies
        
        13.  General
        
        In this Privacy Policy, unless the context requires a different interpretation:
        
        a)     the singular includes the plural and vice versa;
        
        b)     references to sub-clauses, clauses, schedules or appendices are to sub-clauses, clauses, schedules or appendices of this privacy policy;
        
        c)     a reference to a person includes firms, companies, government entities, trusts and partnerships;
        
        d)     "including" is understood to mean "including without limitation";
        
        e)     reference to any statutory provision includes any modification or amendment of it;
        
        f)      the headings and sub-headings do not form part of this privacy policy.
        
        
        
        1.     About this Privacy Policy
        
        This Privacy Policy applies to the personal information we collect about you through our Platform, by telephone, by post, through our social media platforms, from third parties and when you otherwise communicate with us.
        
        This Privacy Policy may change from time to time and, if it does, the up-to-date version will always be available on our Website. We will also tell you about any important changes to our Privacy Policy.
        
        2.     The personal information we collect, how we collect it, and why
        
        Personal information means any information about an individual from which that individual can be identified. The following shows information we process about you, and the purpose for which we process that information. There may be more than one reason for which we collect such information and we have only listed the main reasons. If you would like further information, please contact us at [insert email address].
        
        Information
        
        The main reasons we collect it
        
        Information you provide to us
        
        Account information, including your name, username, date of birth, gender, email address, telephone number and postal address.
        
        Your account information enables us to personally and uniquely identify and communicate with you, both within the Platform, and externally in emails, SMS messages and other forms of communication. It also makes you visible to and identifiable by other Users. We also require this information for billing, account eligibility purposes and account maintenance purposes.
        
        Talent profile information, such as any descriptions about your act or services, photos, testimonials or similar.
        
        Talent profiles enable our Customers to browse the best Talent to suit their needs. More comprehensive profiles are more likely to be selected by Customers.
        
        Information provided during identity checks
        
        We vet our Talent to ensure they have rights to work in the United Kingdom and are suitable for our Platform. We use third party providers to carry out identity checks, who may in turn provide us with any documents (such as ID documents) which you provide to them.
        
        Your preferences for receiving communications and notifications
        
        We store your preferences so we know exactly how to communicate with you (e.g. for marketing or sending service communications), and in some cases, how not to communicate with you.
        
        Information we collect automatically
        
        Free or Paid Plan status
        
        We store whether Talent are on a free or paid membership plan to manage our service and pricing accordingly.
        
        Customer number [Note: Anjan to confirm this and remove if not relevant]
        
        When a member signs up, we generate this as a mechanism to identify a member across our technical systems, and to link that member with their product preferences, billing records, service interaction analytics and customer service history.
        
        Your interactions with our service
        
        
        
        When you interact with our Platform, for example when a Customer makes a booking request, or when Talent accepts a booking request, or when any User leaves a review of another User, we record and track this information for the purposes of maintaining our User profile system, and analysing how our Users enjoy our service so that we can continue to develop it.
        
        
        
        Payment information (e.g. records of transactions, payment tokens)
        
        We record payment and transaction data to keep financial and security records for our business and to comply with our legal obligations to retain financial and transaction information.
        
        We also keep a record of where payments have been successful or have failed against a member’s details in our systems.
        
        IP address
        
        This enables us to uniquely identify you and to distinguish you from other Users. In turn, it enables us to deliver you a more personalised service (e.g. more personalised Platform content).
        
        Records of competitions, promotions, rewards and prizes
        
        Whenever we hold competitions and/or give away rewards or prizes, we keep an internal record of how they have been distributed. We collect data around competitions, how Users interact with them, and we use that data to improve the way we hold competitions and give away rewards or prizes in future.
        
        Information we collect from other sources
        
        Social media information
        
        As part of the sign-up process, we import some of the information you have disclosed to your social media pages, such as Facebook or Google (if you choose to connect to Talent Town via a social network). Equally, certain parts of our service enable you to share our content or information by email, text (SMS) message or other social applications.
        
        
        
        In respect of all the above information, our overarching purpose is to enable us to generate a trusted, secure, engaged and community of Customers and Talent. We want all of our Users’ information to be secure, but also visible to us so that we can provide them personalised customer service and a customised User experience.
        
        3.     Our legal basis for processing personal information
        
        We only ever use your information in line with applicable data protection laws – in particular, the EU General Data Protection Regulation (GDPR). In short, this means we only use it where we have a legal basis to do so. Under GDPR, these are the general legal bases for which we process your personal information, as detailed in the table above:
        
        ·       Consent – you have given us consent to process your personal information for a specific purpose that we have told you about.
        
        ·       Performance of our contract – processing your personal information is necessary for a contract you have with us, or because we have asked you to take specific steps before entering into that contract.
        
        ·       Legitimate interests – processing your personal information is necessary for our legitimate interests or those of a third party, provided those interests are not outweighed by your rights and interests (including where processing is required to comply with or enforce a legal obligation, or to exercise or defend our legal rights).
        
        
        
        4.     When do we share your personal information?
        
        We may disclose your information for certain purposes and to third parties, as described below:
        
        ·       The Talent Town staff and group of companies: we share your information with our staff (including employees, consultants, agents and advisors) and within the Talent Town group of companies as required for: providing you with access to our services according to our agreement, data storage and processing, providing customer support, making internal choices around business improvements, content development, and for the other purposes set out in this Privacy Policy.
        
        ·       Third Party Providers: We use certain companies, agents or contractors (Third Party Providers) to perform services on our behalf or to help deliver our services to you. We contract with Third Party Providers, for example to provide advertising, marketing, communications, insurance, identity checking, infrastructure and IT services, to process credit card transactions or other payment methods, to personalise and enhance our services, to provide customer service, to collect debts, to analyse and action data (including data about our Users’ interactions with our Platform), and to process and administer consumer surveys. In the course of providing such services, these Third Party Providers may have access to your personal information. We do not authorise them to use or disclose your personal information except in connection with providing their services to us.
        
        ·       Promotions with our partners: We may offer joint promotions, schemes or incentives with our selected partners that, in order for you to participate, will require us to share your information with the relevant partner. In fulfilling these types of promotions, we may share your name and other information in connection with fulfilling the relevant incentive. Please note that our partners are responsible for their own privacy and data protection methods and if applicable you should refer to their relevant privacy policy.
        
        ·       To protect legitimate interests: There are certain circumstances where Talent Town and our Third Party Providers may disclose and/or make use of your information where a disclosure would be necessary to: (a) satisfy any applicable law, regulation, legal process, or other legal or governmental request or requirement, (b) enforce applicable terms of use, including investigation of any actual or alleged breaches, (c) detect, prevent, or otherwise address illegal or suspected illegal activities (including payment fraud), security or technical issues, or (d) protect against harm to the rights, property or safety of Talent Town, its members or the public, as required or permitted by law.
        
        ·       Transfers of our business: In connection with any corporate reorganisation, restructuring, investment, merger or sale, or other transfer of assets, we will transfer information, including personal information, provided that the receiving party agrees to comply with our requirements as set out in this Privacy Policy relating to your personal information.
        
        
        
        5.     Communications
        
        This section is to explain how we will ensure that you only receive communications that you wish to receive.
        
        Marketing communications:
        
        We want to ensure that you are informed and aware of the best services and promotions that we can offer you. By consenting to receive additional communications (by mail, telephone, text/picture/video message or email) from us and any named third parties that feature at the point of obtaining consent in respect of such information, we will process your personal information in accordance with this Privacy Policy.
        
        You can change your marketing preferences and unsubscribe at any time by accessing the settings within our Platform or emailing us. If you choose not to receive this information we will be unable to keep you informed of new services and promotions of ours, or the Talent Town group of companies, that may interest you.
        
        Whatever you choose, you’ll still receive other important information, for example service updates, as described below.
        
        Service communications:
        
        As detailed in the table at section 2, we may send you communications such as those which relate to any service updates (e.g. service availability) or provide customer satisfaction surveys. We consider that we can lawfully send these communications to you as we have a legitimate interest to do so, namely to effectively provide you with the best service we can and to grow our business.
        
        6.     How long do we store your personal information?
        
        Unless a longer retention period is required or permitted by law, we will only hold your personal information on our systems for the period necessary to fulfil the purposes outlined in this Privacy Policy or until you request that the Data be deleted. Even if we delete your personal information, it may persist on backup or archival media for legal, tax or regulatory purposes.
        
        In accordance with this Privacy Policy, you have the right to request that we delete your personal information, except where we are legally permitted or required to maintain certain personal information. For example:
        
        ·       We are legally required to retain financial and transaction data for a minimum period of 7 years for tax, audit and accounting purposes. This includes keeping a record of the amount of each transaction, what it related to, and who we transacted with.
        
        ·       If there is an unresolved issue relating to your account, for example relating to outstanding credit or an unresolved dispute, then we will retain your personal information until the issue is resolved.
        
        ·       There may be other situations where we have legitimate business interests to retain personal information, such as to prevent fraud or protect security of our other Users.
        
        Any Third Party Providers that we engage will keep your personal information stored on their systems for as long as is necessary to provide the relevant services to you or us. If we end our relationship with any third party providers, we will make sure that they securely delete or return your personal information to us.
        
        We may retain personal information about you for statistical purposes. Where information is retained for statistical purposes it will always be anonymised, meaning that you will not be identifiable from that information.
        
        7.     Security of your personal information
        
        We are committed to securing and protecting your personal information, and we make sure to implement appropriate technical and organisational measures to help protect the security of your personal information. We adopt various policies including anonymisation, pseudonymisation, encryption, password restricted access, and retention policies to guard against unauthorised access and unnecessary retention of personal information in our systems.
        
        The information that we collect from you may be transferred to, and stored at, a destination outside of the European Economic Area (EEA). When we transfer and store your personal information outside of the EEA we will take steps to ensure that the information is transferred in accordance with this Privacy Policy and applicable data protection laws. In particular, we will ensure that appropriate contractual, technical, and organisational measures are in place with any parties outside the EEA such as the Standard Contractual Clauses approved by the EU Commission.
        
        Unfortunately, the transmission of your personal information via the internet is not completely secure and although we do our best to protect your personal information, we cannot guarantee the security of your information transmitted to us over the internet and you acknowledge that any transmission is at your own risk.
        
        8.     Links
        
        Our Platform may, from time to time, contain links to websites operated by third parties, which will usually be those of our commercial partners. This Privacy Policy only applies to the personal information that we collect from you and we cannot be responsible for personal information collected and stored by third parties. If you click on a link, please understand that the relevant third party websites have their own terms and conditions and privacy policies, and we do not accept any responsibility for the content of those third party websites or third party terms and conditions or policies. Please check these policies before you submit any personal information to these websites.
        
        9.     Age restrictions
        
        You must be 16 years of age or older to use the Platform. We do not knowingly collect personal information from individuals under 16 years of age. If you are under that age limit, then please do not use Talent Town or provide any personal information to us. If you are under 18 years of age, then you will be required to have consent of your parent or guardian to access the Platform and we will only process the basic information which we require from you for so that you can use our Platform. [Note: Ross/Anjan to add in a line when User is accepting the terms (e.g. by tick box) – which only shows if they have said they are 16 or 17 – saying “you agree you have parental consent to use Talent Town”]
        
        If you are a parent or legal guardian of a child under the applicable age limit or accessing the Platform without consent, and you become aware that your child has provided his/her personal information to us, please contact us at [insert email address]. If we learn that we have collected personal information of an individual under the age of 168, then we will take all reasonable steps to delete that information from our systems, and if required, delete the relevant member account.
        
        10.  Your rights and choices
        
        This section explains that you have a number of rights in relation to your personal information.
        
        Under the GDPR, as a User of our Platform, you are entitled to certain rights. There are circumstances in which your rights may not apply. You have the right to request that we:
        
        ·                provide you with a copy of the information we hold about you;
        
        ·                update any of your personal information if it is inaccurate or out of date;
        
        ·                delete the personal information we hold about you - if we are providing services to you and you ask us to delete personal information we hold about you then we may be unable to continue providing those services to you;
        
        ·                restrict the way in which we process your personal information;
        
        ·                stop processing your data if you have valid objections to such processing; and
        
        ·                transfer your personal information to a third party.
        
        For more information on your rights and how to use them, or if you would like to make any of the requests set out above, please contact us via [insert email address].
        
        We may need to request specific information from you to help us confirm your identity and ensure your right to access your personal information (or to exercise any of your other rights). This is a security measure to ensure that personal information is not disclosed to any person who has no right to receive it. We may also contact you to ask you for further information in relation to your request to speed up our response.
        
        As explained in section 4, even if you consented to the processing of your personal information for marketing purposes (by ticking the relevant box or by requesting information about services for example), you have the right to ask us to stop processing your personal information for such purposes. You can exercise this right at any time by contacting us at [insert email address] or adjusting your privacy and notification settings within the Platform. Please note that we reserve the right to charge a fee for responding to requests where we reasonably determine that they are manifestly unfounded or onerous or being made in bad faith.
        
        11.  Contacting us
        
        If you have any questions or concerns about how we handle your personal information, please contact by email to [insert email address].
        
        If you are not satisfied with the way a complaint you make in relation to your Data is handled by us, you may be able to refer your complaint to the relevant data protection authority. For the UK, this is the Information Commissioner's Office (ICO). The ICO's contact details can be found on their website at https://ico.org.uk/.
        
        12.  Cookies
        
        We may use cookies on our Platform which help us monitor use of the Platform, and in turn improve it based on how our Users interact with it. You can choose to accept or turn off cookies within your browser settings.
        
        13.  General
        
        You may not transfer any of your rights under this Privacy Policy to any other person. We may transfer our rights under this privacy policy where we reasonably believe your rights will not be affected.
        
        If any court or competent authority finds that any provision of this Privacy Policy (or part of any provision) is invalid, illegal or unenforceable, that provision or part-provision will, to the extent required, be deemed to be deleted, and the validity and enforceability of the other provisions of this Privacy Policy will not be affected.
        
        Unless otherwise agreed, no delay, act or omission by a party in exercising any right or remedy will be deemed a waiver of that, or any other, right or remedy.
        
        This Privacy Policy will be governed by and interpreted according to the law of England and Wales. All disputes arising under the Agreement will be subject to the exclusive jurisdiction of the English and Welsh courts.`,
        order: 2
    },
];

PolicySchema.statics.getMigrateData = function () {
    return dataMigrate;
}

module.exports = mongoose.model('Policie', PolicySchema);